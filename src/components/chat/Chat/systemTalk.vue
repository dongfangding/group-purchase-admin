<template>
	<div>
		<div class="systemTalk">
			<div class="title">{{ text.title }}</div>
			<div class="subtitle">{{ text.subtitle }}</div>
			<div v-for="item in text.content" :key="JSON.stringify(item)">
				<el-link type="primary" @click.stop="itemCallback(item)">{{ item.text }}</el-link>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		text: {
			type: Object,
			default: () => ({})
		}
	},
	emits: ["systemEvent", "loadDone"],
	mounted() {
		this.$nextTick(() => {
			this.$emit("loadDone", { type: "system", target: this.text });
		});
	},
	methods: {
		itemCallback(itemData) {
			this.$emit("systemEvent", itemData);
		}
	}
};
</script>

<style lang="scss" scoped>
// @import url(); 引入公共css类
.systemTalk {
	display: inline-block;
	padding: 0;
	margin: 0;
	.title {
		width: 100%;
		font-weight: bold;
		border-bottom: 1px solid #dcdfe6;
	}
	.subtitle {
		font-size: 0.5rem;
	}
}
</style>
