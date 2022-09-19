<template>
	<div class="table-box">
		<div :style="{ 'margin-bottom': '8px' }">
			<el-button type="primary" @click="openDialog('新增地址')" plain>新增地址</el-button>
		</div>

		<el-table :data="tableData" style="width: 100%" stripe border>
			<el-table-column fixed prop="province" label="省" width="100" />
			<el-table-column prop="city" label="市" width="100" />
			<el-table-column prop="area" label="区" width="100" />
			<el-table-column prop="receiverName" label="收件人" width="100" />
			<el-table-column prop="mobile" label="联系方式" width="120" />
			<el-table-column prop="detailAddress" label="详细地址" width="180" />
			<el-table-column prop="defaultFlag" label="默认地址" width="120" :formatter="defaultFlagRender"> </el-table-column>
			<el-table-column prop="buildingNo" label="楼号" width="80" />
			<el-table-column prop="roomNo" label="房号" width="80" />
			<el-table-column fixed="right" label="操作" width="120">
				<template #default="scope">
					<el-button link type="primary" size="small" @click="edit(scope.row)">编辑</el-button>
					<el-button link type="primary" size="small" @click="deleteFn(scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<el-dialog
			v-model="dialogVisble"
			:title="dialogTitle"
			:currentRecord="currentRecord"
			width="500px"
			top="50px"
			show-close="false"
		>
			<div :style="{ 'margin-right': '60px' }">
				<el-form
					ref="addressFormRef"
					:model="addressForm"
					size="middle"
					:rules="formRules"
					:label-position="labelPosition"
					label-width="80px"
				>
					<el-form-item prop="province" label="省">
						<el-input v-model="addressForm.province"> </el-input>
					</el-form-item>
					<el-form-item prop="city" label="市">
						<el-input v-model="addressForm.city"> </el-input>
					</el-form-item>
					<el-form-item prop="area" label="区">
						<el-input v-model="addressForm.area"> </el-input>
					</el-form-item>
					<el-form-item prop="receiverName" label="收件人">
						<el-input v-model="addressForm.receiverName"> </el-input>
					</el-form-item>
					<el-form-item prop="mobile" label="联系方式">
						<el-input v-model="addressForm.mobile"> </el-input>
					</el-form-item>
					<el-form-item prop="detailAddress" label="详细地址">
						<el-input type="textarea" :autosize="{ minRows: 3, maxRows: 4 }" v-model="addressForm.detailAddress"> </el-input>
					</el-form-item>
					<el-form-item prop="buildingNo" label="楼栋号">
						<el-input v-model="addressForm.buildingNo"> </el-input>
					</el-form-item>
					<el-form-item prop="roomNo" label="房号">
						<el-input v-model="addressForm.roomNo"> </el-input>
					</el-form-item>
					<el-form-item prop="defaultFlag" label="默认地址">
						<el-checkbox v-model="addressForm.defaultFlag" label="defaultFlag" key="defaultFlag"> 设置为默认地址 </el-checkbox>
					</el-form-item>
				</el-form>
			</div>

			<div :style="{ 'text-align': 'center' }">
				<el-button plain round @click="modifyFn(addressFormRef)" size="large" type="primary" :loading="loading"> 确认 </el-button>
				<el-button plain round @click="closeFn" size="large" type="primary"> 关闭 </el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script lang="ts" setup>
import { ref, onMounted, reactive } from "vue";
import { userAddressList } from "@/api/modules/user";
import type { ElForm } from "element-plus";
import { ElMessage } from "element-plus";
import { modifyUserAddress, deleteUserAddress } from "@/api/modules/user";
import { useHandleData } from "@/hooks/useHandleData";
import { deepCopy } from "@/utils/util";

const tableData = ref<any>([]);
const dialogVisble = ref(false);
const dialogTitle = ref("");
const labelPosition = ref("right");
const currentRecord = ref<any>();

onMounted(() => {
	refreshTableData();
});

// 刷新表格数据
const refreshTableData = () => {
	userAddressList().then((res: any) => {
		tableData.value = res.data;
	});
};

const defaultFlagRender = (row: any) => {
	return row.publicFlag ? "是" : "否";
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
	roomNo: "",
	defaultFlag: false
});

/**
 * 给地址表单属性依次赋值
 */
const fillAddressForm = (formdata: any) => {
	addressForm["id"] = formdata.id;
	addressForm["province"] = formdata.province;
	addressForm["city"] = formdata.city;
	addressForm["area"] = formdata.area;
	addressForm["receiverName"] = formdata.receiverName;
	addressForm["mobile"] = formdata.mobile;
	addressForm["detailAddress"] = formdata.detailAddress;
	addressForm["buildingNo"] = formdata.buildingNo;
	addressForm["roomNo"] = formdata.roomNo;
	addressForm["defaultFlag"] = formdata.defaultFlag;
};

// 打开弹窗
const openDialog = (title: string) => {
	dialogVisble.value = true;
	dialogTitle.value = title;
};

// 修改
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

// 关闭弹窗
const closeFn = () => {
	addressFormRef.value?.resetFields();
	dialogVisble.value = false;
};

// 编辑地址
const edit = (rowdata: any) => {
	let copy = deepCopy(rowdata);
	fillAddressForm(copy);
	openDialog("编辑地址");
};

// 删除地址
const deleteFn = async (rowdata: any) => {
	await useHandleData(deleteUserAddress, rowdata.id, `删除?`);
	refreshTableData();
};
</script>
