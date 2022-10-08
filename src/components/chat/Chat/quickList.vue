<template>
	<div class="quickListBox" v-if="showList.length" ref="quickListBox">
		<div class="quickList">
			<div v-for="(i, k) in showList" :key="k" class="quickItem">
				<span v-html="i.showtext" />
				<i class="enterBtn el-icon-circle-check" title="选择" @click="submit(i)" />
				<!-- <el-button class="enterBtn" type="mini" @click.stop="submit(i)">选择</el-button> -->
			</div>
		</div>
	</div>
</template>

<script>
export default {
	components: {},
	props: {
		list: {
			type: Array,
			default: () => []
		},
		msg: {
			type: String,
			default: ""
		}
	},
	emits: ["submit"],
	data() {
		return {
			scroll: null,
			complete: null
		};
	},
	computed: {
		showList() {
			const msg = this.msg;
			if (!msg) return [];
			const originList = this.list;
			const reg = new RegExp(msg);
			const result = [];
			originList.forEach(i => {
				const { text } = i;
				if (reg.test(text)) {
					const str = text.replace(reg, `<b>${msg}</b>`);
					result.push({ ...i, showtext: str });
				}
			});
			return result;
		}
	},
	methods: {
		submit(target) {
			this.$emit("submit", target);
		}
	}
};
</script>

<style lang="scss" scoped>
// @import url(); 引入公共css类
.quickListBox {
	box-sizing: border-box;
	width: 100%;
	max-height: 100px;
	padding: 0;
	padding: 5px;
	margin: 0;
	overflow: auto;
	text-align: left;
	box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
	transition: all 2s;
	.quickItem {
		display: flex;
		padding: 0.2rem 0;
		&:hover {
			background: #fafafa;
		}
		span {
			display: inline-block;
			width: 100%;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
		.enterBtn {
			align-self: center;
			cursor: pointer;
			&:hover {
				color: red;
			}
		}
	}
}
</style>
