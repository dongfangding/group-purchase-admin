<template>
	<div>
		<el-button @click="handlePay">支付</el-button>
	</div>
</template>

<script setup lang="ts" name="orderTab">
import { pay } from "@/api/modules/master";
import { useHandleData } from "@/hooks/useHandleData";

const payRequest = {
	joinItemId: 21,
	payType: "WECHAT_PAY",
	goodId: "", // 商品id
	goodNum: 100, // 最终商品数量
	remark: "备注",
	receiverName: "收货人名称",
	receiverMobile: "收货人联系电话",
	receiverDetailAddress: "收货人详细地址",
	receiverProvince: "收货人所在区",
	receiverCity: "收货人所在城市",
	receiverArea: "收货人所在区/镇"
};

// 支付
const handlePay = () => {
	useHandleData(pay, payRequest, `确认支付?`);
};
</script>

<style scoped lang="scss"></style>
