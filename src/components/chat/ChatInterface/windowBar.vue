<!--
 * @Author: your name
 * @Date: 2021-03-04 17:23:51
 * @LastEditTime: 2022-04-02 09:57:29
 * @LastEditors: Bian <389701057@qq.com>
 * @Description: In User Settings Edit
 * @FilePath: \JChat\src\components\ChatInterface\windowBar.vue
-->
<template>
	<div class="windowBar" :style="winBarStyle">
		<!-- <div class="toolBarBox">
      <img src="image/three.jpeg" alt="">
    </div> -->
		<div class="winBarBox" ref="windowBar">
			<div>
				<div
					v-for="item in winList"
					:key="item.id"
					:ref="`winItem${item.id}`"
					@click.stop="bindClick(item)"
					:style="winItemStyle"
					:class="{ winItem: true, winActive: activeItem == item.id }"
				>
					<JwChat-item :config="item" />
					<div class="itemOperation">
						<el-button
							type="info"
							icon="el-icon-close"
							circle
							size="small"
							@click.stop="bindOperation({ type: 'remove', target: item })"
						/>
					</div>
				</div>
				<template v-if="!winList.length">
					<JwChat-empty size="8rem" />
					<el-divider style="padding: 0 5px">
						<span style="font-size: 0.2rem">暂无会话</span>
					</el-divider>
				</template>
			</div>
		</div>
	</div>
</template>

<script>
import Scroll from "@/utils/scroll";
export default {
	props: {
		config: {
			type: Object,
			typeof: Object,
			default: () => ({
				list: [],
				active: null,
				width: "150px",
				listHeight: "60px"
			})
		}
	},
	emits: ["click"],
	data() {
		return {
			activeItem: 0,
			moveObj: {},
			scroll: null,
			complete: null,
			operationTimer: null
		};
	},
	computed: {
		winList() {
			const { list = [] } = this.config;
			const winList = list;
			return winList;
		},
		winItemStyle() {
			const { listHeight: height = "60px" } = this.config;
			return {
				height
			};
		},
		winBarStyle() {
			const { width = "150px" } = this.config;
			return {
				width
			};
		}
	},
	watch: {
		"config.active": {
			handler(newVal) {
				if (newVal) {
					this.activeItem = newVal;
				}
			},
			deep: true,
			immediate: true
		},
		"config.list": {
			handler(newVal) {
				if (newVal) {
					this.scrollRefresh();
				}
			},
			deep: true,
			immediate: true
		}
	},
	mounted() {
		const dom = this.$refs.windowBar;
		this.scroll = new Scroll(dom, {
			pullingDown: false
		});
	},
	methods: {
		bindClick(play) {
			const { id } = play;
			this.activeItem = id;
			this.$emit("click", { type: "winBar", data: play });
		},
		bindOperation(play) {
			this.$emit("click", { type: "winBtn", data: play });
		},
		scrollRefresh() {
			if (!this.scroll) return;
			const that = self;
			that.complete = setInterval(function () {
				// 判断文档和所有子资源(图片、音视频等)已完成加载
				if (document.readyState === "complete") {
					window.clearInterval(that.complete);
					that.scroll.refresh();
				}
			}, 50);
		}
	}
};
</script>

<style lang="scss" scoped>
.windowBar {
	display: flex;
	min-width: 150px;
	height: 100%;
	overflow: hidden;
	background: #ffffff;
	border-right: 1px solid #dcdfe6;
	.toolBarBox {
		$bar-size: 60px;

		width: $bar-size;
		border-right: 1px solid #dcdfe6;
		img {
			width: 50px;
		}
	}
	.winBarBox {
		width: calc(100% - 10px);
		height: calc(100% - 20px);
		padding: 0 5px;
		margin-top: 15px;
		overflow: hidden;
	}
	.winItem {
		position: relative;
		display: flex;
		align-items: center;
		overflow: hidden;
		user-select: none;
		background: #ffffff;
		border: 1px solid #f9f9f9;
		transition: transform 0.6s;
		&:hover {
			background: #f9f9f9;
			.itemOperation {
				opacity: 1;
				transform: translateY(0);
			}
		}
		&.winActive {
			background: #f0f0f0;
		}
		.itemOperation {
			position: absolute;
			right: 0;
			display: flex;
			align-items: flex-end;
			justify-content: center;
			height: 100%;
			padding: 0 5px;
			opacity: 0;
			transform: translateY(100%);
			:deep .el-button {
				padding: 0.06rem;
				margin: 0;
				margin-bottom: 0.4rem;
				&:hover {
					background-color: #f56c6c;
					border-color: #f56c6c;
				}
			}
		}
	}
	:deep .el-divider__text {
		padding: 0 5px;
	}
}
</style>
