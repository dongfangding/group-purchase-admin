<template>
	<div>
		<el-descriptions title="团购明细" :column="2">
			<el-descriptions-item label="名称：">{{ dataSource.name }}</el-descriptions-item>
			<el-descriptions-item label="微信二维码：">
				<el-image
					style="width: 100px; height: 100px"
					:src="dataSource.wxIdCardUrl"
					:preview-src-list="[dataSource.wxIdCardUrl]"
					:initial-index="0"
					fit="cover"
				/>
			</el-descriptions-item>
			<el-descriptions-item label="开始时间：">{{ dayjs(dataSource.startTime).format("YYYY-MM-DD") }}</el-descriptions-item>
			<el-descriptions-item label="结束时间：">{{ dayjs(dataSource.endTime).format("YYYY-MM-DD") }}</el-descriptions-item>
			<el-descriptions-item label="商品信息：">{{ dataSource.goodName || "-" }}</el-descriptions-item>
			<el-descriptions-item label="商品描述：">{{ dataSource.goodDescription || "-" }}</el-descriptions-item>
			<el-descriptions-item label="商品图片： ">
				<el-image
					style="width: 100px; height: 100px"
					:src="dataSource.goodPic"
					:preview-src-list="[dataSource.goodPic]"
					:initial-index="0"
					fit="cover"
			/></el-descriptions-item>
			<el-descriptions-item label="商品单价：">￥{{ dataSource.price || 0 }}</el-descriptions-item>
			<el-descriptions-item label="商品库存：">{{ dataSource.stock || 0 }} 个</el-descriptions-item>
			<el-descriptions-item label="备注：">
				<span v-html="dataSource.content || '-'" />
			</el-descriptions-item>
		</el-descriptions>
		<el-divider content-position="left">参团明细</el-divider>
		<el-table :data="dataSource.joinItems || []" style="width: 90%" border stripe>
			<el-table-column prop="goodName" label="商品名称" width="180" />
			<el-table-column prop="goodNum" label="团购数量" width="180" />
			<el-table-column prop="joinUserName" label="成员姓名" />
			<el-table-column prop="formatJoinTime" label="加入时间" />
		</el-table>
	</div>
</template>

<script setup lang="ts" name="UserDrawer">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { requestGroupDetail } from "@/api/modules/master";
import dayjs from "dayjs";

const dataSource = ref<any>({});

const route = useRoute();
const loading = ref(false);

onMounted(() => {
	const groupId = route.params.gid;
	if (groupId) {
		loading.value = true;
		requestGroupDetail({ groupId }).then((res: any) => {
			dataSource.value = res.data;
		});
	}
});
</script>
<style scoped></style>
