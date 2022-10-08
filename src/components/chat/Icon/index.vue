<template>
	<!-- <i :class="['iconfont', 'icon-wenjian' ]"></i> -->
	<svg class="icon" aria-hidden="true">
		<use :xlink:href="`#${type}`"></use>
	</svg>
</template>

<script>
import "./fonts/iconfont";
export default {
	name: "JwChat-icon",
	props: {
		type: {
			type: String,
			required: true
		}
	}
};
</script>

<style lang="scss">
.icon {
	width: 1em;
	height: 1em;
	overflow: hidden;
	vertical-align: -0.15em;
	fill: currentcolor;
}
</style>
