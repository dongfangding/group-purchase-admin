"use strict";
import BScroll from "@better-scroll/core";
import MouseWheel from "@better-scroll/mouse-wheel";
import ScrollBar from "@better-scroll/scroll-bar";
import ObserveDOM from "@better-scroll/observe-dom";
import ObserveImage from "@better-scroll/observe-image";
import PullDown from "@better-scroll/pull-down";

BScroll.use(MouseWheel); // 鼠标
BScroll.use(ScrollBar); // 滚动条
BScroll.use(ObserveDOM); // 自动reset
BScroll.use(ObserveImage); // 图片加载
BScroll.use(PullDown); // 下拉加载

const PHASE = {
	moving: {
		enter: "enter",
		leave: "leave"
	},
	fetching: "fetching",
	succeed: "succeed"
};
class Scroll {
	domPotision = [];
	beforeNode = null;
	viewName = null;
	tipText = "";
	scrollType = "";
	isLoding = false;
	constructor(viewName, userConfig = {}) {
		const {
			scrollType,
			pullingDown = {
				threshold: 70,
				stop: 56,
				mouseWheel: true
			}
		} = userConfig;

		scrollType && (this.scrollType = scrollType);
		this.viewName = viewName;

		const _scroll = new BScroll(viewName, {
			scrollY: true,
			click: true,
			probeType: 3,
			observeDOM: true,
			mouseWheel: true,
			observeImage: true,
			scrollbar: {
				fade: false,
				interactive: true,
				scrollbarTrackClickable: true
			},
			// pullDownRefresh: true,
			pullDownRefresh: pullingDown,
			preventDefault: false
		});
		_scroll.on("scrollEnd", () => {
			this.setLoding(false);
			this.savePosition(); // 保存当前滚动位置
		});
		if (pullingDown) {
			_scroll.on("enterThreshold", () => {
				this.setLoding(true);
				this.setTipText(PHASE.moving.enter);
			});
			_scroll.on("leaveThreshold", () => {
				this.setTipText(PHASE.moving.leave);
			});
		}
		this.Scroll = _scroll;
	}
	refresh() {
		this.Scroll.refresh();
	}
	setTipText(phase = PHASE.default) {
		const ARROW_BOTTOM =
			'<svg width="16" height="16" viewBox="0 0 512 512"><path fill="currentColor" d="M367.997 338.75l-95.998 95.997V17.503h-32v417.242l-95.996-95.995l-22.627 22.627L256 496l134.624-134.623l-22.627-22.627z"></path></svg>';
		const ARROW_UP =
			'<svg width="16" height="16" viewBox="0 0 512 512"><path fill="currentColor" d="M390.624 150.625L256 16L121.376 150.625l22.628 22.627l95.997-95.998v417.982h32V77.257l95.995 95.995l22.628-22.627z"></path></svg>';

		const TEXTS_MAP = {
			enter: `${ARROW_BOTTOM} 下拉`,
			leave: `${ARROW_UP} 刷新`,
			fetching: "加载中...",
			succeed: "刷新完成"
		};
		this.tipText = TEXTS_MAP[phase];
	}

	finishPullDown() {
		this.setTipText(PHASE.succeed);
		// tell BetterScroll to finish pull down
		this.Scroll.finishPullDown();
	}

	setLoding(state) {
		this.isLoding = state;
	}

	pullingDownHandler() {
		this.savePosition(0); // 保存当前滚动位置
		this.setTipText(PHASE.fetching);
	}

	on(fnName, callback) {
		this.Scroll.on(fnName, () => {
			if (fnName === "pullingDown") {
				this.pullingDownHandler();
			}
			callback();
		});
	}

	/**
	 * @description: 更新并保存数据
	 * @param { nodes, dataList } params //传入要保存的节点和要保存的数据
	 * @return {*}
	 */
	saveNodes = (params = {}) => {
		const { nodes = [], dataList } = params;
		let result = [];
		const previous = this.domPotision;
		for (const key in nodes) {
			if (Object.hasOwnProperty.call(nodes, key)) {
				const node = nodes[key];
				const dataStr = JSON.stringify(dataList[key]);
				const top = node.offsetTop;
				let item = {
					top,
					node,
					read: false,
					data: dataStr
				};
				// 是否是存在的数据
				const resultKey = previous.findIndex(i => i.data === dataStr);
				if (typeof resultKey === "number" && resultKey > -1) {
					let { read = false } = previous[resultKey] || {};
					item.read = read;
				}
				result.push(item);
			}
		}
		this.domPotision = result;
		this.readState();
	};

	get unread() {
		let result = 0;
		this.domPotision.forEach(i => {
			const { read } = i;
			if (!read) {
				result += 1;
			}
		});
		return result;
	}

	/**
	 * @description: 设置是否已读
	 * @param {*}
	 * @return {*}
	 */
	readState() {
		const { y } = this.Scroll;
		let currentTop = Math.abs(y);
		const viewSize = this.viewName.clientHeight || 0;
		let resultKey = -1;
		if (this.beforeNode) {
			// 查询之前保存的节点
			resultKey = this.domPotision.findIndex(i => i.data === this.beforeNode.data);
		}
		this.domPotision.forEach((i, j) => {
			const { top, node } = i;
			const itemDomSize = node.clientHeight;
			// 判断元素是否在视窗中
			// 元素显示 超过.9 定为已读
			if (currentTop + viewSize > top + itemDomSize * 0.9 || resultKey > j) {
				i.read = true;
			}
		});
	}

	get isBottom() {
		let result = false;
		const { y, maxScrollY } = this.Scroll;
		result = Math.abs(y) >= Math.abs(maxScrollY);
		return result;
	}

	scrollBottom() {
		this.Scroll.scrollTo(0, this.Scroll.maxScrollY, 200);
	}

	/**
	 * @description: 判断当前的滚动位置是处于哪个元素内
	 * @param {*}
	 * @return {*}
	 */
	scrollPositionDom() {
		const { y } = this.Scroll;
		if (y >= 0) return 0; //大于0表示在上拉
		let currentTop = Math.abs(y);
		const doms = this.domPotision;
		let result = -1;

		doms.forEach((i, j) => {
			const { top } = i;
			if (result === -1) result = j;
			if (currentTop >= top) {
				result = j + 1;
			}
		});

		return result;
	}

	savePosition() {
		const nodeIndex = this.scrollPositionDom();
		this.beforeNode = this.domPotision[nodeIndex];
	}
}

export default Scroll;
