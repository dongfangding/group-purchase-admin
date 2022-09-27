<template>
	<div>
		<div :class="Classes['div-box']">
			<div :style="{ 'font-size': '18px', 'margin-left': '20px', color: 'black' }">
				<el-steps :active="dataSource.trace && dataSource.trace.currentStep" :space="150">
					<el-step
						v-for="item in dataSource.trace ? dataSource.trace.traces : []"
						:title="item.statusName"
						:description="item.ctime ? dayjs(item.ctime * 1000).format('YYYY-MM-DD HH:mm:ss') : ''"
						:key="item.status"
					/>
				</el-steps>
			</div>
		</div>
		<div :class="Classes['div-box']">
			<div :style="{ 'font-size': '18px', 'margin-left': '20px', color: 'black' }">
				<strong>支付状态: {{ dataSource.joinStatusName }}</strong>
			</div>
		</div>
		<div :class="Classes['div-box']">
			<div :class="Classes['row-div']">
				<div :class="Classes['row-div-icon']">
					<el-icon><User /></el-icon>
				</div>
				<div :class="Classes['row-div-content']">
					<span>{{ dataSource.receiverName }}</span> <span>{{ dataSource.receiverMobile }}</span>
				</div>
			</div>
			<div :class="Classes['row-div']">
				<div :class="Classes['row-div-empty']"></div>
				<div :class="Classes['row-div-content']">
					<span>{{ dataSource.receiverDetailAddress }}</span>
				</div>
			</div>
			<div :class="Classes['row-div']">
				<div :class="Classes['row-div-empty']"></div>
				<div :class="Classes['row-div-content']"><span>楼号(如20): </span></div>
			</div>
			<div :class="Classes['row-div']">
				<div :class="Classes['row-div-empty']"></div>
				<div :class="Classes['row-div-content']"><span>房号(如901): </span></div>
			</div>
			<div :class="Classes['row-div']">
				<div :class="Classes['row-div-empty']">
					<el-icon><Document /></el-icon>
				</div>
				<div :class="Classes['row-div-content']">
					<span>订单备注: {{ dataSource.remark || "" }}</span>
				</div>
			</div>
		</div>

		<div :class="Classes['master-div-box']">
			<div :class="Classes['group-master-info-box']">
				<div>
					<el-image :class="Classes['master-pic-image']" fit="fill" :src="dataSource.groupMasterAvatarUrl || ''"></el-image>
				</div>
				<div :class="Classes['master-info']">{{ dataSource.groupMasterNickname }}</div>
				<div :class="Classes['group-name']">{{ dataSource.groupName }}</div>
			</div>
			<el-divider />
			<div :class="Classes['group-master-good-box']">
				<div :class="Classes['good-pic']">
					<el-image
						:class="Classes['good-pic-image']"
						fit="fill"
						:src="dataSource.orderGood ? dataSource.orderGood.groupPurchaseGoodPic : ''"
					></el-image>
				</div>
				<div :class="Classes['good-desc-price-box']">
					<div :class="Classes['good-desc']">
						清风卷纸1600克<br />共{{ dataSource.orderGood ? dataSource.orderGood.goodNum : 0 }}件
					</div>
					<div :class="Classes['good-price']">￥ {{ dataSource.orderGood ? dataSource.orderGood.price : 0 }}</div>
				</div>
			</div>
			<div :class="Classes['group-master-price-box']">
				<div :class="Classes['price-label']">商品金额</div>
				<div :class="Classes['good-total-price']">￥ {{ dataSource.orderGood ? dataSource.orderGood.totalPrice : 0 }}</div>
			</div>
			<el-divider />
			<div :class="Classes['group-master-price-box']">
				<div :class="Classes['price-summary']">
					共{{ dataSource.orderGood ? dataSource.orderGood.goodNum : 0 }}件 实际支付: ￥
					{{ dataSource.orderGood ? dataSource.orderGood.totalPrice : 0 }}
				</div>
			</div>
		</div>

		<div :class="Classes['order-box']">
			<div :class="Classes['order-box-title']">订单信息</div>
			<el-divider />
			<div :class="Classes['order-box-row']">
				<div :class="Classes['order-box-label']">下单人:</div>
				<el-image :class="Classes['join-pic-image']" fit="fill" :src="personInfoForm.avatarUrl || ''"></el-image>
				<div :class="Classes['order-box-content']">
					{{ personInfoForm.nickname }}
				</div>
			</div>
			<div :class="Classes['order-box-row']">
				<div :class="Classes['order-box-label']">订单编号:</div>
				<div :class="Classes['order-box-content']">
					{{ dataSource.orderNo
					}}<el-button :class="Classes['order-box-content-copy']" v-copy="dataSource.orderNo">复制</el-button>
				</div>
			</div>
			<div :class="Classes['order-box-row']">
				<div :class="Classes['order-box-label']">支付时间:</div>
				<div :class="Classes['order-box-content']">
					{{ dataSource.payTime ? dayjs(dataSource.payTime * 1000).format("YYYY/MM/DD HH:mm:ss") : "未付款" }}
				</div>
			</div>
		</div>
		<div>
			<el-affix :offset="50" :style="{ float: 'right', 'margin-right': '30%' }" position="bottom">
				<el-button type="primary" @click="$router.back()">返回</el-button>
			</el-affix>
		</div>
	</div>
</template>

<script setup lang="ts" name="UserDrawer">
import { ref, onMounted, toRef } from "vue";
import { useRoute } from "vue-router";
import { orderDetail } from "@/api/modules/master";
import dayjs from "dayjs";
import { GlobalStore } from "@/store";

const globalStore = GlobalStore();

// 用户表单数据
let personInfoForm = toRef(globalStore, "userInfo");

const dataSource = ref<any>({});
// 团购状态字典
// const groupTraceMap = ref<any>();
// const groupStatusSteps = ref(0);

const route = useRoute();
const loading = ref(false);

onMounted(() => {
	const joinItemId = route.params.joinItemId;
	if (joinItemId) {
		loading.value = true;
		orderDetail(joinItemId).then((res: any) => {
			dataSource.value = res.data;
			// groupStatusSteps.value = dataSource.value.groupTraceList[dataSource.value.groupTraceList.length - 1].status;
			// groupTraceMap.value = Object.fromEntries(dataSource.value.groupTraceList.map(({ status, ctime }: any) => [status, ctime]));
		});
	}
});
</script>
<style module="Classes">
.div-box {
	box-sizing: border-box;
	width: 60%;
	padding: 20px 0 20px 10px;
	margin-top: 10px;
	font-size: 14px;
	color: gray;
	text-align: left;
	background-color: white;
	border-radius: 4px;
	box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
}
.row-div {
	padding: 2px;
	line-height: 22px;
}
.row-div .row-div-icon {
	display: inline-block;
	width: 10px;
	margin-left: 10px;
}
.row-div .row-div-empty {
	display: inline-block;
	width: 10px;
	margin-left: 10px;
	border: 1px;
}
.row-div .row-div-content {
	display: inline-block;
	margin-left: 10px;
}
.master-div-box {
	box-sizing: border-box;
	width: 60%;
	padding: 10px 0 20px 10px;
	margin-top: 10px;
	font-size: 14px;
	text-align: left;
	background-color: white;
	border-radius: 4px;
	box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
}
.group-master-info-box {
	display: flex;
	margin-left: 10px;
}
.group-master-info-box .master-pic-image {
	flex: 1;
	width: 20px;
	height: 20px;
	font-size: 16px;
	line-height: 20px;
}
.group-master-info-box .master-info {
	flex: 1;
	margin-left: 2px;
	font-size: 16px;
	line-height: 20px;
}
.group-master-info-box .group-name {
	flex: 1;
	padding-right: 20px;
	font-size: 16px;
	line-height: 20px;
	text-align: right;
}
.group-master-good-box {
	display: flex;
	height: 150px;
	margin-left: 10px;
}
.good-pic-image {
	width: 130px;
	height: 150px;
}
.group-master-good-box .good-pic {
	width: 130px;
	height: 150px;
	vertical-align: middle;
}
.group-master-good-box .good-desc-price-box {
	display: flex;
	flex: 1;
	width: 80px;
	height: 150px;
	vertical-align: middle;
}
.group-master-good-box .good-desc {
	flex: 1;
	width: 200px;
	height: 150px;
	margin-left: 10px;
	color: gray;
	vertical-align: top;
}
.group-master-good-box .good-price {
	flex: 1;
	height: 150px;
	padding-right: 20px;
	color: gray;
	text-align: right;
	vertical-align: top;
}
.group-master-price-box {
	display: flex;
	margin: 10px 0 0 10px;
}
.group-master-price-box .price-label {
	flex: 1;
	font-size: 14px;
	color: gray;
}
.group-master-price-box .good-total-price {
	flex: 1;
	padding-right: 20px;
	font-size: 14px;
	color: gray;
	text-align: right;
}
.group-master-price-box .price-summary {
	flex: 1;
	padding-right: 20px;
	color: gray;
	text-align: right;
}
.order-box {
	box-sizing: border-box;
	width: 60%;
	padding: 10px 0 20px 10px;
	margin-top: 10px;
	font-size: 14px;
	text-align: left;
	background-color: white;
	border-radius: 4px;
	box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
}
.order-box-row {
	margin-left: 10px;
}
.order-box-title {
	margin-left: 10px;
	font-size: 18px;
	text-align: left;
}
.order-box-label {
	display: inline-block;
	width: 70px;
	margin-top: 5px;
	line-height: 14px;
	color: gray;
	text-align: left;
}
.join-pic-image {
	width: 14px;
	height: 14px;
	margin-right: 3px;
}
.order-box-content {
	display: inline-block;
	margin-top: 5px;
	line-height: 14px;
	color: gray;
	text-align: left;
}
.order-box-content-copy {
	width: 20px;
	height: 14px;
	margin-left: 5px;
	line-height: 14px;
}
</style>
