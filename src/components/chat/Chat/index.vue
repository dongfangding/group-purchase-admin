<!-- eslint-disable vue/no-unused-vars -->
<template>
	<div>
		<div class="chatPage" :style="setStyle">
			<div class="taleBox">
				<chatList
					ref="chatList"
					:list="taleList"
					@click="$emit('clickTalk', $event)"
					@loadHistory="loadHistoryHandler"
					:config="chatListConfig"
				/>
			</div>
			<div class="toolBox">
				<tools :tools="toolConfig" class="tools" @emoji="bindEmoji"> <template #default="tools"></template></tools>
				<quickList :list="quickList" :msg="msg" class="quickList" @submit="quickSubmit" />
				<EnterBox @submit="$emit('enter', $event)" v-model="msg" :insert="insert" />
			</div>
		</div>
	</div>
</template>

<script>
import EnterBox from "./enterBox.vue";
import chatList from "./chatList.vue";
import tools from "./tools.vue";
import quickList from "./quickList.vue";
export default {
	name: "JwChat",
	components: { EnterBox, chatList, tools, quickList },
	props: {
		taleList: {
			type: Array,
			default: () => []
		},
		height: {
			type: String,
			default: "500px"
		},
		width: {
			type: String,
			default: "550px"
		},
		value: {
			type: String,
			default: ""
		},
		scrollType: {
			type: String,
			default: ""
		},
		toolConfig: {
			type: Object
			// default: () => ({
			//   show: [],
			//   showEmoji: true,
			//   callback: Function
			// })
		},
		config: {
			type: Object
		},
		quickList: {
			type: Array,
			default: () => []
		}
	},
	emits: ["enter", "clickTalk", "input"],
	data() {
		return {
			msg: "",
			insert: ""
		};
	},
	computed: {
		setStyle() {
			let height = this.height;
			let width = this.width;
			if (`${height}`.match(/\d$/)) {
				height += "px";
			}
			if (`${width}`.match(/\d$/)) {
				width += "px";
			}
			const style = { height, width };
			return style;
		},
		talkHeight() {
			let height = this.height;
			if (`${height}`.match(/\d$/)) {
				height -= 140;
			} else height = `calc(${height} - 140px)`;
			return height;
		},
		chatListConfig() {
			const { width, talkHeight: height, scrollType, config: { historyConfig = {} } = {} } = self;
			return { width, height, scrollType, historyConfig };
		}
	},
	watch: {
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
		}
	},
	methods: {
		bindEmoji(emoji) {
			this.insert = emoji;
			this.$nextTick(() => {
				this.insert = "";
			});
		},
		loadHistoryHandler() {
			const { historyConfig: { callback = null } = {} } = this.chatListConfig;
			callback && callback();
		},
		quickSubmit(target) {
			const { text } = target;
			this.msg = text;
			this.$nextTick(() => {
				this.$emit("enter", target);
				this.msg = "";
			});
		},
		finishPullDown() {
			this.$refs.chatList.finishPullDown();
		}
	}
};
</script>
<style lang="scss" scoped>
.chatPage {
	position: relative;
	margin: 0 auto;
	overflow: hidden;
	background: #ffffff;
	.taleBox {
		height: calc(100% - 140px);
		min-height: 100px;
		overflow: hidden;
	}
	.toolBox {
		position: relative;
		height: 140px;
		box-shadow: 0 2px 4px rgb(0 0 0 / 12%), 0 0 6px rgb(0 0 0 / 4%);
		.quickList {
			position: absolute;
			z-index: 5;
			background: #ffffff;
			transform: translateY(-100%);
		}
	}
}
</style>
