<template>
	<div>
		<el-tabs v-model="activeName" class="demo-tabs">
			<el-tab-pane label="全部" name="all"><OrderIndex joinStatus="null" /></el-tab-pane>
			<el-tab-pane label="待支付" name="wait_pay"><OrderIndex joinStatus="0" /></el-tab-pane>
			<el-tab-pane label="已完成" name="complete"><OrderIndex joinStatus="1" /></el-tab-pane>
			<el-tab-pane label="已退款" name="refund"><OrderIndex joinStatus="2" /></el-tab-pane>
		</el-tabs>
	</div>
</template>

<script setup lang="ts" name="orderTab">
import OrderIndex from "@/views/order/index.vue";
import { ref } from "vue";

const activeName = ref("all");
</script>

<style scoped lang="scss"></style>
