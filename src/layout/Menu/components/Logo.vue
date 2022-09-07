<template>
	<div class="logo flx-center">
		<img src="@/assets/images/logo.svg" alt="logo" :style="{ 'margin-left': '10px' }" />
		<span v-show="!isCollapse">团购吧</span>
	</div>
</template>

<script setup lang="ts">
defineProps<{ isCollapse: boolean }>();
</script>

<style scoped lang="scss">
@import "../index.scss";
</style>
