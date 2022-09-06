<template>
	<el-table :data="tableData" style="width: 100%" stripe border>
		<el-table-column fixed prop="province" label="省" width="100" />
		<el-table-column prop="city" label="市" width="100" />
		<el-table-column prop="area" label="区" width="100" />
		<el-table-column prop="receiverName" label="收货人" width="100" />
		<el-table-column prop="mobile" label="联系方式" width="120" />
		<el-table-column prop="detailAddress" label="详细地址" width="180" />
		<el-table-column prop="buildingNo" label="楼号" width="80" />
		<el-table-column prop="roomNo" label="房号" width="80" />
		<el-table-column fixed="right" label="操作" width="120">
			<template #default>
				<el-button link type="primary" size="small" @click="handleClick">Detail</el-button>
				<el-button link type="primary" size="small">Edit</el-button>
			</template>
		</el-table-column>
	</el-table>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { userAddressList } from "@/api/modules/user";
const tableData = ref<any>([]);

onMounted(() => {
	userAddressList().then((res: any) => {
		tableData.value = res.data;
	});
});

const handleClick = () => {
	console.log("click");
};
</script>
