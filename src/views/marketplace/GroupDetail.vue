<template>
	<div>
		<el-descriptions title="团购明细" :column="2" largem border>
			<el-descriptions-item label="名称：">{{ dataSource.name }}</el-descriptions-item>
			<el-descriptions-item label="商品信息：">{{ dataSource.goodName || "-" }}</el-descriptions-item>
			<el-descriptions-item label="开始时间：">{{
				dayjs(dataSource.startTime * 1000).format("YYYY-MM-DD")
			}}</el-descriptions-item>
			<el-descriptions-item label="商品描述：">{{ dataSource.goodDescription || "-" }}</el-descriptions-item>
			<el-descriptions-item label="结束时间：">{{ dayjs(dataSource.endTime * 1000).format("YYYY-MM-DD") }}</el-descriptions-item>
			<el-descriptions-item label="商品单价：">￥{{ dataSource.price || 0 }}</el-descriptions-item>
			<el-descriptions-item label="微信二维码：">
				<el-image
					style="width: 100px; height: 100px"
					:src="dataSource.wxIdCardUrl"
					:preview-src-list="[dataSource.wxIdCardUrl]"
					:initial-index="0"
					fit="cover"
				/>
			</el-descriptions-item>

			<el-descriptions-item label="商品图片： ">
				<el-image
					style="width: 100px; height: 100px"
					:src="dataSource.goodPic"
					:preview-src-list="[dataSource.goodPic]"
					:initial-index="0"
					fit="cover"
			/></el-descriptions-item>
			<el-descriptions-item></el-descriptions-item>
			<el-descriptions-item label="商品库存：">{{ dataSource.stock || 0 }} 个</el-descriptions-item>
		</el-descriptions>
		<el-divider content-position="left">备注</el-divider>
		<div><span v-html="dataSource.content || '-'" /></div>
		<el-divider content-position="left">跟团记录</el-divider>
		<el-table :data="dataSource.joinItems || []" style="width: 90%" border stripe>
			<el-table-column prop="goodName" label="商品名称" width="180" />
			<el-table-column prop="joinUserName" label="昵称" />
			<el-table-column prop="goodNum" label="购买数量" width="180" />
			<el-table-column prop="formatJoinTime" label="跟团时间" />
			<el-table-column :formatter="formatJoinItemAddress" prop="formatJoinTime" label="收货地址" v-if="addressVisible" />
		</el-table>
		<div>
			<el-affix :offset="50" :style="{ float: 'right' }" position="bottom">
				<el-button type="primary" @click="$router.back()">返回</el-button>
			</el-affix>
		</div>
	</div>
</template>

<script setup lang="ts" name="UserDrawer">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { requestGroupDetail } from "@/api/modules/master";
import { GlobalStore } from "@/store";
import dayjs from "dayjs";

const dataSource = ref<any>({});
const globalStore = GlobalStore();

const addressVisible = ref(false);

const route = useRoute();
const loading = ref(false);

onMounted(() => {
	const groupId = route.params.gid;
	if (groupId) {
		loading.value = true;
		requestGroupDetail({ groupId }).then((res: any) => {
			dataSource.value = res.data;
			if (globalStore.userInfo.id == dataSource.value.groupMasterUid) {
				addressVisible.value = true;
			}
		});
	}
});
// 渲染收货地址
const formatJoinItemAddress = (row: any) => {
	return (
		row.receiverProvince ||
		"" +
			(row.receiverCity || "") +
			(row.receiverArea || "") +
			(row.receiverDetailAddress || "") +
			"\r\n" +
			(row.receiverName || "") +
			"-" +
			(row.receiverMobile || "") +
			"\r\n" +
			(row.receiverBuildingNo || "") +
			"号" +
			(row.receiverRoomNo || "")
	);
};
</script>
<style scoped></style>
