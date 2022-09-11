<script setup lang="ts" name="marketplaceComponent">
import { myJoinGroup } from "@/api/modules/master";
import { ref, watch } from "vue";
import dayjs from "dayjs";
import { useRouter } from "vue-router";

const route = useRouter();

const page = ref(1);
const dataSource = ref<any[]>([]);
const total = ref(0);
const dialogVisible = ref(false);
const currentRecord = ref<any>({});

// 接收父组件传过来的值
const props = defineProps({
	joinStatus: {
		// 参团状态
		type: String,
		default: () => null
	}
});

// 支付
const handlePay = (item: any) => {
	route.push("pay", item);
};

watch(
	page,
	() => {
		myJoinGroup({ pageNum: page.value, pageSize: 20, joinStatus: props.joinStatus } as any).then((res: any) => {
			dataSource.value = res.data?.content || [];
			total.value = res.total || 0;
		});
	},
	{ immediate: true }
);

watch(dialogVisible, newVal => {
	if (!newVal) {
		currentRecord.value = {};
	}
});
</script>

<template>
	<div class="table-box">
		<div :style="{ overflow: 'auto', margin: '-8px' }">
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
						<div>
							<div :class="Classes['item-group-join-info']">
								<span>100人跟团</span>
							</div>
							<div :class="Classes['item-group-join-info']">
								<span>1000人查看</span>
							</div>
						</div>
					</div>

					<div :class="Classes['item-title']">
						<!-- <el-tag :class="Classes['item-title-tag']" effect="plain" size="small">已隐藏</el-tag> -->
						<span>{{ item.name || "-" }}</span>
					</div>
					<div :class="Classes['item-time']">
						<span>参团时间: {{ dayjs(item.joinTime * 1000).format("YYYY-MM-DD HH:mm:ss") }}</span>
					</div>
					<div :class="Classes['item-time']">
						<span>订单变更时间: {{ dayjs(item.statusChangeTime).format("YYYY-MM-DD HH:mm:ss") }}</span>
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
								<span>￥ {{ item.totalPrice }}</span>
							</div>
							<div :class="Classes['item-join-good-num']">
								<span>共{{ item.goodNum }}件</span>
							</div>
						</div>
					</div>
					<div :class="Classes['item-operate']">
						<div :class="Classes['item-operate-status']">{{ item.joinStatusName }}</div>
						<div :class="Classes['item-operate-btns']">
							<el-button :class="Classes.btn" size="small" @click="$router.push({ name: 'Detail', params: { gid: item.id } })"
								>详情</el-button
							>
							<el-button Primary size="small" @click="handlePay(item)" v-show="item.joinStatus == 0">支付</el-button>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div :style="{ position: 'sticky', bottom: '-22px', textAlign: 'right', background: '#fff', marginRight: '-16px' }">
			<el-pagination layout="prev, pager, next" :total="total" @current-change="(p: number) => (page = p)" />
		</div>
	</div>
</template>

<style module="Classes">
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
}
.item-group-avatar-image {
	flex: 1;
	height: 50px;
	margin-right: 4px;
}
.item-group-join-info {
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
	margin-left: 0;
	font-size: 8px;
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
</style>
