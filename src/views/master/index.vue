<template>
	<div>
		<el-dialog v-model="importDialogVisible" title="从微信接龙导入" width="30%">
			<el-button v-copy="importExample" style="margin-bottom: 15px">复制</el-button>
			<el-input
				v-model="wxText"
				autosize
				type="textarea"
				placeholder="将微信接龙文案完全复制粘贴到当前输入框中，注意换行，不要改变原格式"
			/>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="importDialogVisible = false">Cancel</el-button>
					<el-button type="primary" @click="confirmImport">Confirm</el-button>
				</span>
			</template>
		</el-dialog>
		<el-dialog v-model="updateStatusDialogVisible" title="更改团购状态" width="30%">
			状态:&nbsp;<el-select v-model="dialogGroupStatus" placeholder="请选择更改后状态" clearable>
				<el-option v-for="item in groupStatus" :key="item.value" :label="item.label" :value="item.value" />
			</el-select>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="updateStatusDialogVisible = false">Cancel</el-button>
					<el-button type="primary" @click="confirmUpdateStatus">Confirm</el-button>
				</span>
			</template>
		</el-dialog>
		<div class="table-box">
			<ProTable
				ref="proTable"
				:columns="columns"
				:requestApi="myInitiatedGroup"
				:initParam="initParam"
				:dataCallback="dataCallback"
			>
				<!-- 表格 header 按钮 -->
				<template #tableHeader="scope">
					<el-button type="primary" :icon="CirclePlus" @click="openDrawer('新增')">创建团购</el-button>
					<el-button type="primary" :icon="DocumentCopy" @click="importDialogVisible = true">导入微信接龙文案</el-button>
					<el-button
						type="danger"
						:icon="Delete"
						plain
						:disabled="!scope.isSelected"
						@click="batchDelete(scope.ids)"
						v-if="BUTTONS.batchDelete"
					>
						批量删除用户
					</el-button>
				</template>
				<template #publicFlag="scope">
					{{ scope.publicFlag ? "已发布" : "未发布" }}
				</template>
				<!-- 表格操作 -->
				<template #operation="scope">
					<el-button type="primary" link @click="$router.push({ name: 'Detail', params: { gid: scope.row.id } })">查看</el-button>
					<el-button type="primary" link @click="$router.push({ name: 'Edit', params: { gid: scope.row.id } })">编辑</el-button>
					<el-button type="primary" link @click="openUpdateStatusDialog(scope.row)">变更状态</el-button>
					<el-button type="primary" link @click="publishGroupFn(scope.row)">发布</el-button>
				</template>
			</ProTable>
			<ImportExcel ref="dialogRef" />
		</div>
	</div>
</template>

<script setup lang="ts" name="useComponent">
import { ref, reactive } from "vue";
import { Master } from "@/api/interface/index";
import { groupStatus } from "@/utils/serviceDict";
import { ColumnProps } from "@/components/ProTable/interface";
import { useHandleData } from "@/hooks/useHandleData";
import { useAuthButtons } from "@/hooks/useAuthButtons";
import ProTable from "@/components/ProTable/index.vue";
import ImportExcel from "@/components/ImportExcel/index.vue";
import { CirclePlus, Delete, DocumentCopy } from "@element-plus/icons-vue";
import { deleteUser } from "@/api/modules/user";
import {
	myInitiatedGroup,
	createFromWxJieLong,
	// customizeCreate,
	// modifyGroupInfo,
	updateGroupStatus,
	publishGroup
} from "@/api/modules/master";

// 获取 ProTable 元素，调用其获取刷新数据方法（还能获取到当前查询参数，方便导出携带参数）
const proTable = ref();
// 导入团购
let importDialogVisible = ref(false);
let updateStatusDialogVisible = ref(false);
const wxText = ref("");
const dialogGroupStatus = ref("");
const dialogGroupId = ref();
const importExample = ref<string>(
	"#接龙\n半个南瓜 等会送来 共20份\n例 楼栋号-房间号 需要多少份\n\n1.295-909 6份\n2.295-910 8份\n3.295-204 2份\n\n三点截单"
);
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

// 页面按钮权限
const { BUTTONS } = useAuthButtons();

// 表格配置项
const columns: Partial<ColumnProps>[] = [
	{ type: "selection", width: 80, fixed: "left" },
	{ type: "index", label: "#", width: 80 },
	{ prop: "name", label: "团购名称" },
	{ prop: "statusName", label: "状态", width: 80 },
	{ prop: "formatStartTime", label: "开始时间", width: 180 },
	{ prop: "formatEndTime", label: "结束时间", width: 180 },
	{ prop: "publicFlag", label: "是否已发布", width: 100 },
	{ prop: "operation", label: "操作", width: 320, fixed: "right" }
];

// 确认导入微信接龙文案
const confirmImport = async () => {
	await createFromWxJieLong({ text: ref(wxText).value });
	importDialogVisible.value = false;
	proTable.value.refresh();
};

const openUpdateStatusDialog = async (params: Master.List) => {
	dialogGroupId.value = params.id;
	// 不会处理传参的时候是字符串，但是渲染的时候又是数值，所只能先清除掉，让界面没有值，至少不是错的
	dialogGroupStatus.value = "";
	updateStatusDialogVisible.value = true;
};

// 确认更改团购状态
const confirmUpdateStatus = async () => {
	await updateGroupStatus({ id: dialogGroupId.value, status: dialogGroupStatus.value });
	updateStatusDialogVisible.value = false;
	dialogGroupStatus.value = "";
	dialogGroupId.value = null;
	proTable.value.refresh();
};

// 发布团购
const publishGroupFn = async (params: Master.List) => {
	await useHandleData(publishGroup, { id: params.id, publicFlag: !params.publicFlag }, `确认发布？`);
	proTable.value.refresh();
};

// 批量删除用户信息
const batchDelete = async (id: string[]) => {
	await useHandleData(deleteUser, { id }, "删除所选用户信息");
	proTable.value.refresh();
};

// 批量添加用户
interface DialogExpose {
	acceptParams: (params: any) => void;
}
const dialogRef = ref<DialogExpose>();

// 打开 drawer(新增、查看、编辑)
// interface GroupDrawerProps {
// 	acceptParams: (params: any) => void;
// }
// const drawerRef = ref<GroupDrawerProps>();
// const openDrawer = (title: string, rowData: Partial<Master.CustomizeCreateRequest> = { name: "" }) => {
// 	let params = {
// 		title,
// 		rowData: { ...rowData },
// 		isView: title === "查看",
// 		apiUrl: title === "新增" ? customizeCreate : title === "编辑" ? modifyGroupInfo : "",
// 		getTableList: proTable.value.refresh
// 	};
// 	drawerRef.value!.acceptParams(params);
// };
</script>
<style scoped>
.dialog-footer button:first-child {
	margin-right: 10px;
}
</style>
