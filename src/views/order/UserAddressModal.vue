<template>
	<el-dialog :modelValue="visible" @update:model-value="$emit('update:visible', $event)" :width="600" title="选择地址">
		<div>
			<div :style="{ 'margin-bottom': '8px' }">
				<el-button type="primary" @click="openDialog('新增地址')" plain>新增地址</el-button>
			</div>

			<el-table :data="tableData" style="width: 100%" border highlight-current-row @current-change="handleCurrentChange">
				<el-table-column type="index" width="50" />
				<el-table-column prop="receiverName" label="收件人" width="100" />
				<el-table-column prop="mobile" label="联系方式" width="150" />
				<el-table-column prop="detailAddress" label="详细地址" width="260" />
			</el-table>

			<el-dialog v-model="dialogVisble" :title="dialogTitle" width="500px" top="50px">
				<div :style="{ 'margin-right': '60px' }">
					<el-form
						ref="addressFormRef"
						:model="addressForm"
						size="middle"
						:rules="formRules"
						:label-position="labelPosition"
						label-width="80px"
					>
						<el-form-item prop="receiverName" label="收件人">
							<el-input v-model="addressForm.receiverName"> </el-input>
						</el-form-item>
						<el-form-item prop="mobile" label="联系方式">
							<el-input v-model="addressForm.mobile"> </el-input>
						</el-form-item>
						<el-form-item prop="detailAddress" label="详细地址">
							<el-input type="textarea" :autosize="{ minRows: 3, maxRows: 4 }" v-model="addressForm.detailAddress"> </el-input>
						</el-form-item>
					</el-form>
				</div>

				<div :style="{ 'text-align': 'center' }">
					<el-button plain round @click="modifyFn(addressFormRef)" size="large" type="primary" :loading="loading">
						确认
					</el-button>
				</div>
			</el-dialog>
		</div>
		<template #footer>
			<div class="dialog-footer">
				<el-button @click="$emit('update:visible', false)">取消</el-button>
				<el-button type="primary" :disabled="!currentRow" @click="handleConfirm">确认选择</el-button>
			</div>
		</template>
	</el-dialog>
</template>

<script lang="ts" setup>
import { ref, onMounted, reactive } from "vue";
import { userAddressList } from "@/api/modules/user";
import type { ElForm } from "element-plus";
import { ElMessage } from "element-plus";
import { modifyUserAddress } from "@/api/modules/user";

// eslint-disable-next-line vue/require-prop-types
defineProps(["visible"]);

const emit = defineEmits(["update:visible", "ok"]);

const tableData = ref<any>([]);
const dialogVisble = ref(false);
const dialogTitle = ref("");
const currentRow = ref(null);
const labelPosition = ref("right");

onMounted(() => {
	refreshTableData();
});

// 刷新表格数据
const refreshTableData = () => {
	userAddressList().then((res: any) => {
		tableData.value = res.data;
	});
};

const loading = ref<boolean>(false);
type FormInstance = InstanceType<typeof ElForm>;
const addressFormRef = ref<FormInstance>();
const formRules = reactive({
	receiverName: [{ required: true, message: "请输入收件人", trigger: "blur" }],
	mobile: [{ required: true, message: "请输入联系方式", trigger: "blur" }],
	detailAddress: [{ required: true, message: "请输入详细地址", trigger: "blur" }]
});
// 地址表单数据
const addressForm = reactive<any>({
	id: null,
	province: "",
	city: "",
	area: "",
	receiverName: "",
	mobile: "",
	detailAddress: "",
	buildingNo: "",
	roomNo: ""
});

// 打开弹窗
const openDialog = (title: string) => {
	dialogVisble.value = true;
	dialogTitle.value = title;
};

// 修改地址
const modifyFn = (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	formEl.validate(async valid => {
		if (!valid) return;
		try {
			await modifyUserAddress(addressForm);
			ElMessage.success("修改成功！");
			refreshTableData();
			addressFormRef.value?.resetFields();
			dialogVisble.value = false;
		} finally {
			loading.value = false;
		}
	});
};
const handleCurrentChange = (val: any) => {
	currentRow.value = val;
};
const handleConfirm = () => {
	emit("ok", currentRow.value);
	emit("update:visible", false);
};
</script>
