<template>
	<div>
		<!-- <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick"> -->
		<el-tabs v-model="activeName" class="demo-tabs">
			<el-tab-pane label="全部" name=""></el-tab-pane>
			<el-tab-pane lazy label="待支付" name="WAIT_PAY"></el-tab-pane>
			<el-tab-pane lazy label="待收货" name="PA"></el-tab-pane>
			<el-tab-pane lazy label="已完成" name="COMPLETE"></el-tab-pane>
			<el-tab-pane lazy label="已退款" name="REFUND"></el-tab-pane>
			<el-tab-pane lazy label="已关闭" name="CLOSED"></el-tab-pane>
		</el-tabs>
		<OrderIndex :key="activeName" :joinStatus="activeName == 0 ? '' : activeName" />
	</div>
</template>

<script setup name="orderTab">
import OrderIndex from "@/views/order/index.vue";
import { ref } from "vue";

const activeName = ref("");
</script>

<style scoped lang="scss"></style>
