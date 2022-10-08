<template>
	<div class="ChatPage" :style="faceSize">
		<WinBar v-if="JSON.stringify(winBarConfig) !== '{}'" class="winBar" :config="winBarConfig" @click="winBarClick" />
		<div class="header">
			<JwChat-item :config="config" @click="bindClick" />
			<slot name="header" />
		</div>
		<div class="main">
			<div class="chatBox">
				<JwChat
					ref="jwChat"
					:taleList="taleList"
					@enter="$emit('enter', $event)"
					v-model="msg"
					:toolConfig="toolConfig"
					:scrollType="scrollType"
					:width="realWidth"
					:height="chatHeight"
					:config="chatConfig"
					:quickList="quickList"
					@clickTalk="$emit('clickTalk', $event)"
				>
					<!-- <slot name="tools" slot="tools" /> -->
					<slot name="tools" />
				</JwChat>
			</div>
			<div class="rightBox" v-if="showRightBox">
				<span @click="switchBox = !switchBox">
					<JwChat-icon class="switch" :type="switchIcon" />
				</span>
				<slot v-if="switchBox" />
			</div>
		</div>
	</div>
</template>

<script>
import WinBar from "./windowBar.vue";
export default {
	name: "JwChat-index",
	components: {
		WinBar
	},
	props: {
		config: {
			type: Object,
			default: () => ({
				img: "image/cover.png",
				name: "JwChat",
				dept: "最简单、最便捷",
				callback: () => {}
			})
		},
		showRightBox: {
			type: Boolean,
			default: true
		},
		taleList: {
			type: Array,
			default: () => {
				return [];
			}
		},
		height: {
			type: String,
			default: "570"
		},
		width: {
			type: String,
			default: "750"
		},
		value: {
			type: String,
			default: ""
		},
		toolConfig: {
			type: Object
		},
		winBarConfig: {
			type: Object,
			default: () => ({})
		},
		scrollType: {
			type: String,
			default: "noroll"
		}
	},
	emits: ["input", "clickTalk", "enter"],
	data() {
		return {
			chatHeight: "",
			msg: "",
			switchBox: true
		};
	},
	computed: {
		faceSize() {
			let height = this.height;
			let width = this.width + "";
			if (height.match(/\d$/)) {
				height += "px";
			}
			if (width.match(/\d$/)) {
				width += "px";
			}
			const style = { height, width };
			return style;
		},
		chatConfig() {
			const { historyConfig = {} } = this.config || {};
			return { historyConfig };
		},
		switchIcon() {
			let result = "icon-jiantou-xiangzuo";
			if (this.switchBox) result = "icon-jiantou-xiangyou";
			return result;
		},
		realWidth() {
			const width = this.width;
			let ratio = 1;
			if (this.showRightBox && this.switchBox) ratio = 0.7;
			return width * ratio + "";
		},
		quickList() {
			const { quickList = [] } = this.config;
			return quickList;
		}
	},
	watch: {
		height: {
			handler() {
				this.chatHeight = this.height - 60 + "";
			},
			immediate: true
		},
		value: {
			handler() {
				this.msg = this.value;
			},
			immediate: true
		},
		msg: {
			handler() {
				this.$emit("input", this.msg);
			},
			immediate: true
		},
		showRightBox: {
			handler(newval) {
				if (typeof newval === "boolean") this.switchBox = newval;
			},
			immediate: true
		}
	},
	methods: {
		bindClick(type) {
			const { callback } = this.config || {};
			if (callback) {
				callback(type);
			}
		},
		winBarClick(play) {
			const { callback = null } = this.winBarConfig;
			if (callback) {
				callback(play);
			}
		},
		finishPullDown() {
			this.$refs.jwChat.finishPullDown();
		}
	}
};
</script>

<style scoped lang="scss">
.ChatPage {
	position: relative;
	margin: 0 auto;
	background: #ffffff;
	box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
	.winBar {
		position: absolute;
		transform: translateX(-100%);
	}
	.header {
		position: relative;
		display: flex;
		align-items: center;
		height: 60px;
		padding-left: 12px;
		margin: 0 auto;
		color: #ffffff;
		background-color: #409eff;
	}
	.main {
		display: flex;
		height: calc(100% - 60px);
		.rightBox {
			position: relative;
			width: 45%;
			box-shadow: 0 -3px 3px 0 rgb(0 0 0 / 10%);
			.switch {
				position: absolute;
				top: 20%;
				left: -1.2rem;
				padding: 0.3rem 0 0.3rem 0.1rem;
				color: #ffffff;
				cursor: pointer;
				background: rgb(204 204 204 / 50%);
				border-radius: 100% 0 0 100%;
				&:hover {
					background: #409eff;
				}
			}
		}
	}
}
</style>
