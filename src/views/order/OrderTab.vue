<template>
	<div>
		<el-tabs v-model="activeName" class="demo-tabs">
			<el-tab-pane label="全部" name="all"><OrderIndex joinStatus="" /></el-tab-pane>
			<el-tab-pane label="待支付" name="wait_pay"><OrderIndex joinStatus="WAIT_PAY" /></el-tab-pane>
			<el-tab-pane label="已完成" name="complete"><OrderIndex joinStatus="COMPLETE" /></el-tab-pane>
			<el-tab-pane label="已退款" name="refund"><OrderIndex joinStatus="REFUND" /></el-tab-pane>
			<el-tab-pane label="已关闭" name="closed"><OrderIndex joinStatus="CLOSED" /></el-tab-pane>
		</el-tabs>
	</div>
</template>

<script setup lang="ts" name="orderTab">
import OrderIndex from "@/views/order/index.vue";
import { ref } from "vue";

const activeName = ref("all");
</script>

<style scoped lang="scss"></style>
