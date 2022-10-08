<template>
	<div>
		<div class="shopTalk" @click="itemCallback">
			<div class="cover">
				<img :src="text.cover" alt />
			</div>
			<div class="price">{{ text.price }}</div>
			<div class="title">{{ text.title }}</div>
			<div class="subtitle" v-if="text.describe">{{ text.describe }}</div>
			<div class="tagBox" v-if="text.tags && text.tags.length">
				<span v-for="(i, k) in text.tags" :key="k">
					{{ i.name }}
				</span>
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
	emits: ["loadDone", "systemEvent"],
	mounted() {
		this.$nextTick(() => {
			this.$emit("loadDone", { type: "shop", target: this.text });
		});
	},
	methods: {
		itemCallback() {
			this.$emit("systemEvent", { ...this.text, type: "shop" });
		}
	}
};
</script>

<style lang="scss" scoped>
// @import url(); 引入公共css类
.shopTalk {
	display: inline-block;
	width: 200px;
	padding: 0;
	margin: 0;
	.price {
		font-weight: bold;
		color: #c16e3e;
	}
	.cover {
		width: 100%;
		img {
			width: 100%;
			max-height: 300px;
		}
	}
	.title {
		display: -webkit-box;
		width: 100%;
		overflow: hidden;
		font-weight: bold;
		text-overflow: ellipsis;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
	}
	.subtitle {
		font-size: 0.5rem;
		border-top: 1px solid #dcdfe6;
	}
	.tagBox {
		span {
			display: inline-block;
			padding: 2px 10px;
			margin: 2px 5px;
			font-size: 0.7rem;
			color: #c16e3e;
			background: #fed6be;
			border-radius: 30px;
		}
	}
}
</style>
