<script setup name="marketplaceComponent">
import { ElMessageBox } from "element-plus";
import { myJoinGroup, pay } from "@/api/modules/master";
import { ref, watch, onMounted } from "vue";
import dayjs from "dayjs";
import UserAddressModal from "./UserAddressModal.vue";
import { defaultUserAddress } from "@/api/modules/user";
import { useRouter } from "vue-router";
import countDown from "@/components/CountDown/index.vue";

const router = useRouter();
const page = ref(1);
const pageSize = ref(10);
const dataSource = ref([]);
const total = ref(0);
const drawerVisible = ref(false);
const currentRecord = ref({});
const addressVisible = ref(false);
// 用户默认收货地址
const userDefaultAddress = ref({});

const formData = ref(currentRecord);

// 接收父组件传过来的值
const props = defineProps({
	joinStatus: {
		// 参团状态
		type: String,
		default: () => null
	}
});

onMounted(() => {
	// 用户默认收货地址
	defaultUserAddress().then(res => {
		userDefaultAddress.value = res.data || {};
	});
});

// 用用户设置的默认收货地址填充下单界面的收货地址
const fillDefaultAddress = () => {
	currentRecord.value.receiverName = userDefaultAddress.value.receiverName || "";
	currentRecord.value.receiverDetailAddress = userDefaultAddress.value.detailAddress || "";
	currentRecord.value.receiverMobile = userDefaultAddress.value.mobile || "";
};

// 支付
const handlePay = item => {
	if (item.joinTime + item.payCountDownSeconds <= new Date() / 1000) {
		ElMessageBox.alert("订单已过期，不可支付~");
		refreshData();
		return;
	}
	currentRecord.value = item;
	fillDefaultAddress();
	drawerVisible.value = true;
};

// 倒计时结束事件
const countDoenOverFn = () => {
	// 倒计时结束，刷新订单数据
	refreshData();
};

const handleSelectAddress = val => {
	formData.value = {
		...formData.value,
		receiverDetailAddress: val.detailAddress,
		receiverMobile: val.mobile,
		receiverName: val.receiverName
	};
};

const cancelClick = () => {
	addressVisible.value = false;
	drawerVisible.value = false;
};

const confirmClick = () => {
	ElMessageBox.confirm("确定要提交支付吗?")
		.then(() => {
			pay({
				...formData.value,
				totalPrice: (currentRecord.value.price || 0) * (formData.value.goodNum || 0) || 0
			}).then(() => {
				drawerVisible.value = false;
				refreshData();
			});
		})
		.catch(() => {
			// catch error
		});
};

// 查看团购详情，注意不是订单详情
const redirectGroupDetailFn = item => {
	router.replace({ name: "Detail", params: { gid: item.groupId } });
};

// 刷新数据
const refreshData = () => {
	myJoinGroup({ pageNum: page.value, pageSize: pageSize.value, joinStatus: props.joinStatus }).then(res => {
		dataSource.value = res.data?.content || [];
		total.value = res.data.total || 0;
	});
};

watch(
	page,
	() => {
		refreshData();
	},
	{ immediate: true }
);

watch(currentRecord, () => {
	formData.value = currentRecord.value || {};
});

watch(drawerVisible, newVal => {
	if (!newVal) {
		currentRecord.value = {};
	}
});
</script>

<template>
	<div class="table-box">
		<div :style="{ overflow: 'auto', margin: '-8px' }" v-if="dataSource.length">
			<div
				:style="{
					display: 'flex',
					flexWrap: 'wrap',
					justifyContent: 'space-between',
					maxWidth: '1200px',
					overflow: 'visible',
					padding: '8px'
				}"
			>
				<div v-for="item of dataSource" :key="item.id" :class="Classes['item-wrapper']">
					<div :class="Classes['item-group-master']">
						<div>
							<el-image :class="Classes['item-group-avatar-image']" :src="item.groupMasterAvatarUrl" />
						</div>
						<div :class="Classes['item-group-master-name']">
							{{ item.groupMasterName }}
						</div>
						<div :class="Classes['item-title']">
							<a href="#" @click.prevent="redirectGroupDetailFn(item)"
								>{{ item.name }}<span :style="{ color: 'gray' }">></span></a
							>
						</div>
					</div>

					<!-- <div :class="Classes['item-title']">
						<div>
							<div :class="Classes['item-group-join-info']">
								<span>100人跟团</span>
							</div>
							<div :class="Classes['item-group-join-info']">
								<span>1000人查看</span>
							</div>
						</div>
					</div> -->
					<div :class="Classes['item-time']">
						<span>参团时间: {{ dayjs(item.joinTime * 1000).format("YYYY-MM-DD HH:mm:ss") }}</span>
					</div>
					<div :class="Classes['item-time']">
						<span>订单变更时间: {{ dayjs(item.statusChangeTime * 1000).format("YYYY-MM-DD HH:mm:ss") }}</span>
					</div>
					<div :class="Classes['item-join']">
						<div>
							<el-image :class="Classes['item-group-avatar-image']" :src="item.goodPic" />
						</div>
						<div :class="Classes['item-join-good-description']">
							{{ item.goodDescription }}
						</div>
						<div>
							<div :class="Classes['item-join-info']">
								<span>￥{{ item.totalPrice }}</span>
							</div>
							<div :class="Classes['item-join-good-num']">
								<span>共{{ item.goodNum }}件</span>
							</div>
						</div>
					</div>
					<div :class="Classes['item-operate']">
						<div :class="Classes['item-operate-status']">{{ item.joinStatusName }}</div>
						<count-down
							:endTime="item.joinTime + item.payCountDownSeconds"
							endText="已过期"
							suffix="后关闭订单"
							v-if="item.joinStatus == 0"
							@count-down-over="countDoenOverFn"
						/>
						<div :class="Classes['item-operate-btns']">
							<el-button Primary size="small" @click="handlePay(item)" v-if="item.joinStatus == 0">支付</el-button>
						</div>
					</div>
				</div>
			</div>
		</div>
		<el-empty description="暂无数据" v-else />
		<div :style="{ position: 'sticky', bottom: '-22px', textAlign: 'right', background: '#fff', marginRight: '-16px' }">
			<el-pagination layout="prev, pager, next" :total="total" @current-change="p => (page = p)" :page-size="pageSize" />
		</div>
	</div>
	<el-drawer v-model="drawerVisible" title="订单信息" size="400" direction="rtl" :custom-class="Classes.drawer">
		<section :class="Classes['section-wrapper']" @click="addressVisible = true">
			<div :style="{ display: 'flex', alignItems: 'center', cursor: 'pointer' }">
				<div :style="{ flex: 1 }">
					<template v-if="currentRecord?.receiverName">
						<span
							><strong>{{ formData.receiverName }}</strong
							>{{ formData.receiverMobile }}</span
						>
						<div>{{ formData.receiverDetailAddress }}</div>
					</template>
					<div v-else>请选择收货地址</div>
				</div>
				<el-icon :style="{ width: '20px', marginLeft: '10px' }" size="20"><ArrowRightBold /></el-icon>
			</div>
		</section>
		<section :class="Classes['section-wrapper']">
			<div :style="{ display: 'flex' }">
				<img :style="{ width: '160px', height: '160px' }" :src="currentRecord.goodPic" />
				<section
					:style="{ display: 'flex', flex: 1, flexDirection: 'column', justifyContent: 'space-between', marginLeft: '10px' }"
				>
					<div>
						<strong>{{ currentRecord.goodName }}</strong>
						<div>{{ currentRecord.goodDescription }}</div>
					</div>
					<div>
						<div>￥{{ currentRecord.price }}</div>
						<el-form-item>
							<el-input-number v-model="formData.goodNum" />
						</el-form-item>
					</div>
				</section>
			</div>
			<div :style="{ borderTop: '1px solid #f0f0f0', marginTop: '8px', paddingTop: '10px' }">
				<span>商品总价</span>
				<span>￥{{}}</span>
			</div>
			<div>
				共 {{ formData.goodNum }} 件
				<strong
					>实际支付 <span>￥{{ (currentRecord.price || 0) * (formData.goodNum || 0) || 0 }}</span></strong
				>
			</div>
		</section>
		<section :class="Classes['section-wrapper']">
			备注：<el-form-item name="content">
				<el-input v-model="formData.remark" autosize type="textarea" placeholder="请输入您需要备注的内容" />
			</el-form-item>
		</section>
		<section :class="Classes['section-wrapper']">
			<el-radio-group v-model="formData.payType" size="large">
				<el-radio-button label="微信支付" value="WECHAT_PAY" />
				<el-radio-button label="支付宝支付" value="ZHIFU_PAY" />
			</el-radio-group>
		</section>
		<template #footer>
			<div style="flex: auto">
				<el-button @click="cancelClick">取消</el-button>
				<el-button type="primary" @click="confirmClick">确认支付</el-button>
			</div>
		</template>
	</el-drawer>
	<UserAddressModal v-model:visible="addressVisible" @ok="handleSelectAddress" />
</template>

<style module="Classes">
.drawer {
	padding: 0;
}
.item-wrapper {
	display: inline-block;
	width: 30%;
	padding: 8px;
	margin-bottom: 16px;
	background-color: white;
	border-radius: 8px;
	box-shadow: 1px 0 8px -1px rgb(0 0 0.5);
}
.item-group-master {
	display: flex;
	align-items: center;
	justify-content: center;
}
.item-group-master-name {
	flex: 1;
	margin-left: 5px;
	text-align: left;
}
.item-group-avatar-image {
	flex: 1;
	height: 50px;
	margin-right: 4px;
}
.item-group-gray {
	font-size: 10px;
	color: gray;
}
.item-join {
	display: flex;
	align-items: center;
	justify-content: center;
}
.item-join-good-description {
	flex: 1;
	margin-left: 10px;
	font-size: 12px;
	color: gray;
}
.item-join-image {
	flex: 1;
	height: 50px;
	margin-right: 4px;
}
.item-join-info {
	font-size: 16px;
	color: red;
}
.item-join-good-num {
	font-size: 8px;
	color: gray;
}
.item-title {
	font-size: 18px;
	font-weight: 500;
	color: #000000;
	text-decoration-line: none;
}
.item-title a {
	text-decoration-line: none;
}
.item-title-tag {
	margin-right: 6px;
	color: gray;
	vertical-align: middle;
	border-color: gray;
}
.item-time {
	margin-top: 8px;
	margin-bottom: 8px;
}
.item-time > span {
	font-size: 12px;
}
.item-images {
	display: flex;
	align-items: center;
	justify-content: space-between;
}
.item-image {
	flex: 1;
	height: 100px;
	margin-right: 4px;
}
.item-operate {
	display: flex;
	align-items: center;
	justify-content: center;
	margin-top: 10px;
	font-size: 14px;
}
.item-operate-status {
	flex: 1;
	color: #ff0000;
}
.item-operate-btns > .btn:nth-child(2) {
	background-color: lightgray;
	border: none;
}
.item-operate-btns > .btn:nth-child(1) {
	color: gray;
	border-color: gray;
}
.item-description {
	display: inline-block;
	margin-right: 10px;
	font-size: 12px;
	color: gray;
}
.item-description-value {
	margin-left: 6px;
}
.section-wrapper {
	padding: 10px;
	border-bottom: 10px solid #f0f0f0;
}
</style>
<style>
.el-drawer__body {
	padding: 0 !important;
}
.el-form-item--default {
	margin-bottom: 0;
}
ul,
li {
	padding: 0;
	margin: 0;
	list-style: none;
}
</style>
