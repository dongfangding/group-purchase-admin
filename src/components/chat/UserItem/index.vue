<template>
	<div class="item">
		<el-badge :value="config.readNum" :hidden="config.readNum < 1">
			<img
				v-if="config.img"
				:src="config.img"
				:style="coverSize"
				class="cover"
				@click="bindClick({ key: 'cover', value: config })"
			/>
		</el-badge>
		<div class="info">
			<p class="name" @click="bindClick({ key: 'name', value: config })">{{ config.name }}</p>
			<p class="dept" @click="bindClick({ key: 'dept', value: config })">{{ config.dept }}</p>
		</div>
	</div>
</template>

<script>
export default {
	name: "JwChat-item",
	props: {
		config: {
			type: Object,
			default: () => ({
				img: "",
				name: "JwChat",
				dept: ""
			}),
			required: true
		},
		size: {
			type: Number,
			default: 35
		}
	},
	emits: ["click"],
	computed: {
		coverSize() {
			let size = this.size;
			if (`${size}`.match(/\d$/)) {
				size += "px";
			}
			return {
				width: size,
				height: size
			};
		}
	},
	methods: {
		bindClick(type) {
			const target = type;
			this.$emit("click", target);
		}
	}
};
</script>
<style lang="scss" scoped>
.item {
	position: relative;
	display: flex;
	align-items: center;
	.cover {
		margin-right: 12px;
		cursor: pointer;
		border-radius: 50%;
		box-shadow: 0 3px 3px 0 rgb(0 0 0 / 10%);
	}
	.info {
		display: flex;
		flex-direction: column;
		justify-content: center;
		p {
			padding: 0;
			margin: 0;
			overflow: hidden;
			font-size: 13px;
			text-align: left;

			/* width: 175px; */
			text-overflow: ellipsis;
			white-space: nowrap;
			cursor: pointer;
			&:hover {
				opacity: 0.8;
			}
			&:last-child {
				font-size: 12px;
			}
		}
	}
}
</style>
