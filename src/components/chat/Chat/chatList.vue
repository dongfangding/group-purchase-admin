<template>
	<div class="wrapper" :style="boxSize">
		<div class="scroller" ref="scroller">
			<div class="web__main" ref="main">
				<div class="pulldown-wrapper">
					<div v-html="historyConfig.tip"></div>
				</div>
				<template v-for="(item, k) in list">
					<el-divider v-if="item.type === 'tip'" :key="JSON.stringify(item) + k">{{ item.text }}</el-divider>
					<div v-else class="web__main-item" :key="JSON.stringify(item) + k + 100" :class="{ 'web__main-item--mine': item.mine }">
						<div class="web__main-user">
							<img :src="item.img" @click="$emit('click', { type: 'img', data: item })" />
							<cite @click="$emit('click', { type: 'nickname', data: item })">
								{{ item.name }}
								<i>{{ item.date }}</i>
							</cite>
						</div>
						<div class="web__main-text">
							<div class="web__main-arrow"></div>
							<itemTalk v-if="item.text.text" :text="item.text.text" @systemEvent="taskEvent" @loadDone="loadDone" />
							<systemTalk v-if="item.text.system" :text="item.text.system" @systemEvent="systemEvent" @loadDone="loadDone" />
							<el-link @click="taskEvent(item.text)" v-if="item.text.subLink" v-bind="item.text.subLink.prop" class="itemChild">
								{{ item.text.subLink.text }}
							</el-link>
							<shopTalk v-if="item.text.shop" :text="item.text.shop" @systemEvent="taskEvent" @loadDone="loadDone" />
						</div>
					</div>
				</template>
			</div>
		</div>
		<div class="downBtn" v-if="showDownBtn" @click="scrollBottom">
			<span v-if="unread">{{ unread }}</span>
		</div>
	</div>
</template>

<script>
import Scroll from "@/utils/scroll";
import itemTalk from "./itemTalk.vue";
import systemTalk from "./systemTalk.vue";
import shopTalk from "./shopTalk.vue";
export default {
	name: "JwChat_list",
	components: { itemTalk, systemTalk, shopTalk },
	props: {
		list: {
			type: Array,
			default: () => []
		},
		config: {
			type: Object,
			default: () => ({})
		}
	},
	emits: ["click"],
	data() {
		return {
			scroll: null,
			// remind: null, // 消息提示
			stopScroll: false
		};
	},
	computed: {
		boxSize() {
			let { height = "382px", width = "525px" } = this.config || {};
			if (`${height}`.match(/\d$/)) {
				height += "px";
			}
			if (`${width}`.match(/\d$/)) {
				width += "px";
			}
			return { height, width };
		},
		historyConfig() {
			const { tip = "", show = false } = this.config.historyConfig || {};
			const { tipText } = this.scroll || {};
			return { tip: tip || tipText, show };
		},
		scrollType() {
			const { scrollType = "noroll" } = this.config;
			return scrollType;
		},
		unread() {
			const { unread = 0 } = this.scroll || {};
			return unread;
		},
		showDownBtn() {
			if (this.scroll) return !this.scroll.isBottom;
			return false;
		}
	},
	watch: {
		// unread (newval) {
		//   newval && Remind.showBrowser.call(this)
		//   if(!this.remind) return
		//   if (newval) {
		//     this.remind.changeTitle(newval)
		//   } else {
		//     this.remind.resetTitle()
		//   }
		// },
		boxSize() {
			this.scroll.refresh();
		}
	},
	mounted() {
		this.createScroll();
		// this.remind = new Remind()
	},
	methods: {
		loadDone() {
			if (this.scrollType == "scroll") {
				this.scrollBottom();
			}
		},
		scrollBottom() {
			if (!this.scroll) return;
			if (this.scroll.isLoding) return;
			this.scroll.refresh();
			this.scroll.scrollBottom();
		},
		createScroll() {
			const { show: pullingDown = false } = this.historyConfig || {};
			this.scroll = new Scroll(this.$refs.scroller, {
				scrollType: this.scrollType,
				pullingDown
			});
			// 保存数据
			this.scroll.on("refresh", this.childnodeLoad);
			// 刷新
			pullingDown && this.scroll.on("pullingDown", this.pullingDownHandler);
		},
		finishPullDown() {
			this.scroll.finishPullDown();
		},
		childnodeLoad() {
			if (this.scrollType !== "noroll") return;
			const parent = this.$refs.main;
			if (!parent) return;
			const [, ...childs] = parent.children;
			this.scroll.saveNodes({ nodes: childs, dataList: this.list });
		},
		pullingDownHandler() {
			this.$emit("loadHistory");
		},
		systemEvent(itemData) {
			this.$emit("click", { type: "systemItem", data: itemData });
		},
		taskEvent(itemData) {
			this.$emit("click", { type: "taskItem", data: itemData });
		}
	}
};
</script>

<style scoped lang="scss">
:deep.iScrollVerticalScrollbar.iScrollLoneScrollbar {
	z-index: 1 !important;
}
.wrapper {
	position: relative;
	width: 525px;
	height: 382px;
	overflow: hidden;

	/* Prevent native touch events on Windows */
	touch-action: none;

	/* Prevent text resize on orientation change, useful for web-apps */
	text-size-adjust: none;
	.downBtn {
		position: absolute;
		right: 1rem;
		bottom: 2rem;
		width: 2rem;
		height: 2rem;
		cursor: pointer;
		&::before {
			position: absolute;
			top: 60%;
			left: 50%;
			width: 2rem;
			height: 2rem;
			line-height: 2rem;
			text-align: center;
			content: "V";
			background: rgb(204 204 204 / 20%);
			border-radius: 50%;
			transform: translateX(-50%);
		}
		span {
			position: absolute;
			top: 50%;
			left: 50%;
			padding: 0.1rem 0.5rem;
			font-size: 0.7rem;
			color: #ffffff;
			background: #409eff;
			border-radius: 0.5rem;
			transform: translate(-50%, -50%);
		}
	}
	.scroller {
		width: 100%;
		height: 100%;
	}
	.web__main {
		position: absolute;
		width: calc(100% - 1.5rem);
		padding: 0.5rem;
		padding-right: 1.5rem;

		/* Prevent elements to be highlighted on tap */
		-webkit-tap-highlight-color: rgb(0 0 0 / 0%);

		/* Put the scroller into the HW Compositing layer right from the start */
		transform: translateZ(0);
		.web__main-item {
			position: relative;
			min-height: 68px;
			padding-left: 60px;
			margin-bottom: 10px;
			font-size: 0;
			text-align: left;
		}
		.sysTip {
			font-size: 1rem;
			text-align: center;
		}
		.web__main-user,
		.web__main-text {
			display: inline-block;
			font-size: 14px;
			vertical-align: top;
		}
		.web__main-user {
			position: absolute;
			left: 3px;
			cursor: pointer;
			img {
				width: 40px;
				height: 40px;
				border-radius: 100%;
			}
			cite {
				position: absolute;
				top: -2px;
				left: 60px;
				font-size: 12px;
				font-style: normal;

				/* width: 500px; */
				line-height: 24px;
				color: #999999;
				text-align: left;
				white-space: nowrap;
				i {
					padding-left: 15px;
					font-style: normal;
				}
			}
		}
		.web__main-text {
			position: relative;
			max-width: 75%;
			padding: 8px 15px;
			margin-top: 25px;
			line-height: 22px;
			color: #000000;
			word-break: break-all;
			background-color: #f3f3f3;
			border: 1px solid #f0f0f0;
			border-radius: 3px;
		}
		.web__main-arrow {
			position: absolute;
			top: 6px;
			left: -8px;
			display: block;
			width: 0;
			height: 0;
			border-color: transparent;
			border-style: solid;
			border-width: 8px;
			border-right-color: #ebeef5;
			border-left-width: 0;
			&::after {
				position: absolute;
				top: -7px;
				left: 1px;
				display: block;
				width: 0;
				height: 0;
				content: " ";
				border-color: transparent;
				border-style: solid;
				border-width: 7px;
				border-right-color: #ebeef5;
				border-left-width: 0;
			}
		}
		.web__main-item--mine .web__main-text .web__main-arrow {
			right: -5px;
			left: auto;
			border-color: transparent;
			border-style: solid;
			border-width: 8px;
			border-right-width: 0;
			border-left-color: #409eff;
			&::after {
				right: -2px;
				left: auto;
				border-color: transparent;
				border-style: solid;
				border-width: 7px;
				border-right-width: 0;
				border-left-color: #409eff;
			}
		}
		.web__main-list {
			margin: 10px 0;
			li {
				height: 30px;
				line-height: 30px;
				color: #409eff;
			}
		}
		.web__main-item--mine {
			padding-right: 60px;
			padding-left: 0;
			text-align: right;
			.web__main-user {
				right: 3px;
				left: auto;
				cite {
					right: 60px;
					left: auto;
					text-align: right;
					i {
						padding-right: 15px;
						padding-left: 0;
					}
				}
			}
			.web__main-text {
				margin-left: 0;
				color: #ffffff;
				text-align: left;
				background-color: #409eff;
				img {
					max-width: 200px;
				}
			}
		}
	}
}
.pulldown-wrapper {
	position: absolute;
	box-sizing: border-box;
	width: 100%;
	padding: 20px;
	color: #999999;
	text-align: center;
	transform: translateY(-100%) translateZ(0);
}
</style>
