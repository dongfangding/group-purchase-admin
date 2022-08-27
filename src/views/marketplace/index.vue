<template>
	<div>
		<div class="table-box">
			<ProTable
				ref="proTable"
				:columns="columns"
				:requestApi="marketplaceGroupPageList"
				:initParam="initParam"
				:dataCallback="dataCallback"
			>
				<!-- 表格操作 -->
				<template #operation="scope">
					<el-button type="primary" link :icon="View" @click="openDrawer('查看', scope.row)">查看</el-button>
				</template>
			</ProTable>
			<GroupDrawer ref="drawerRef" />
			<ImportExcel ref="dialogRef" />
		</div>
	</div>
</template>

<script setup lang="tsx" name="marketplaceComponent">
import { ref, reactive } from "vue";
import { Master } from "@/api/interface/index";
import { ColumnProps } from "@/components/ProTable/interface";
import ProTable from "@/components/ProTable/index.vue";
import ImportExcel from "@/components/ImportExcel/index.vue";
import GroupDrawer from "@/views/master/GroupDrawer.vue";
import { View } from "@element-plus/icons-vue";
import { marketplaceGroupPageList } from "@/api/modules/master";

// 获取 ProTable 元素，调用其获取刷新数据方法（还能获取到当前查询参数，方便导出携带参数）
const proTable = ref();
// 如果表格需要初始化请求参数，直接定义传给 ProTable(之后每次请求都会自动带上该参数，此参数更改之后也会一直带上，改变此参数会自动刷新表格数据)
const initParam = reactive({});

// dataCallback 是对于返回的表格数据做处理，如果你后台返回的数据不是 datalist && total && pageNum && pageSize 这些字段，那么你可以在这里进行处理成这些字段
const dataCallback = (data: any) => {
	return {
		datalist: data.content,
		total: data.total,
		pageNum: data.pageNum,
		pageSize: data.pageSize
	};
};

// 表格配置项
const columns: Partial<ColumnProps>[] = [
	{ type: "selection", width: 80, fixed: "left" },
	{ type: "index", label: "#", width: 80 },
	{ prop: "name", label: "团购名称", width: 220 },
	{ prop: "statusName", label: "状态", width: 80 },
	{ prop: "formatStartTime", label: "开始时间", width: 170 },
	{ prop: "formatEndTime", label: "结束时间", width: 170 },
	{ prop: "publicFlag", label: "是否已发布", width: 100 },
	{ prop: "operation", label: "操作", width: 320, fixed: "right" }
];

// 批量添加用户
interface DialogExpose {
	acceptParams: (params: any) => void;
}
const dialogRef = ref<DialogExpose>();

// 打开 drawer(新增、查看、编辑)
interface GroupDrawerProps {
	acceptParams: (params: any) => void;
}
const drawerRef = ref<GroupDrawerProps>();
const openDrawer = (title: string, rowData: Partial<Master.CustomizeCreateRequest> = { name: "" }) => {
	let params = {
		title,
		rowData: { ...rowData },
		isView: title === "查看",
		getTableList: proTable.value.refresh
	};
	drawerRef.value!.acceptParams(params);
};
</script>
<style scoped>
.dialog-footer button:first-child {
	margin-right: 10px;
}
</style>
