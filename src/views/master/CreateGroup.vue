<template>
	<div>
		<el-form
			ref="ruleFormRef"
			:rules="rules"
			:disabled="drawerData.isView"
			:model="drawerData.rowData"
			label-width="150px"
			label-suffix=" :"
			:hide-required-asterisk="drawerData.isView"
		>
			<el-form-item label="名称" prop="name">
				<el-input v-model="drawerData.rowData!.name" placeholder="请填写团购名称" clearable></el-input>
			</el-form-item>
			<el-form-item label="微信二维码" prop="wxIdCardUrl">
				<UploadImg
					v-model:file="drawerData.rowData!.wxIdCardUrl"
					:disabled="drawerData.isView"
					:upload-style="{ width: '120px', height: '120px' }"
					@check-validate="checkValidate('wxIdCardUrl')"
				>
					<template #tip> 头像大小不能超过 3M </template>
				</UploadImg>
			</el-form-item>
			<el-form-item label="开始时间">
				<el-date-picker
					v-model="drawerData.rowData!.startTime"
					type="date"
					placeholder="开始时间"
					format="YYYY/MM/DD"
					value-format="X"
				/>
			</el-form-item>
			<el-form-item label="结束时间">
				<el-date-picker
					v-model="drawerData.rowData!.endTime"
					type="date"
					placeholder="结束时间"
					format="YYYY/MM/DD"
					value-format="X"
				/>
			</el-form-item>

			<el-form-item label="商品信息" prop="goodName">
				<el-input v-model="drawerData.rowData!.goodName" placeholder="请填写商品信息" clearable></el-input>
			</el-form-item>
			<el-form-item label="商品描述" prop="goodDescription">
				<el-input v-model="drawerData.rowData!.goodDescription" placeholder="请填写商品描述" clearable></el-input>
			</el-form-item>
			<el-form-item label="商品单价" prop="price">
				<el-input type="number" v-model="drawerData.rowData!.price" placeholder="请填写商品单价" clearable></el-input>
			</el-form-item>
			<el-form-item label="商品库存" prop="stock">
				<el-input type="number" v-model="drawerData.rowData!.stock" placeholder="请填写商品库存" clearable></el-input>
			</el-form-item>
			<el-form-item>
				<div class="content-box">
					<WangEditor height="400px" v-model:value="drawerData.rowData!.content" />
				</div>
			</el-form-item>
			<el-form-item
				:style="{
					position: 'sticky',
					margin: '0 -20px -20px -20px',
					bottom: '-20px',
					zIndex: 10,
					background: '#fff',
					padding: '8px 0',
					border: '1px solid rgb(221 221 221)'
				}"
			>
				<el-button @click="dialogVisible = true">内容预览</el-button>
				<el-button @click="$router.back()">取消</el-button>
				<el-button type="primary" v-show="!drawerData.isView" @click="handleSubmit">提交</el-button>
			</el-form-item>
		</el-form>
		<el-dialog v-model="dialogVisible" title="富文本内容预览" width="1300px" top="50px">
			<div class="view" v-html="drawerData.rowData!.content"></div>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="UserDrawer">
import { Master } from "@/api/interface/index";
import { ref, reactive, onMounted } from "vue";
// import { genderType } from "@/utils/serviceDict";
import { ElMessage, FormInstance } from "element-plus";
import UploadImg from "@/components/UploadImg/index.vue";
import WangEditor from "@/components/WangEditor/index.vue";
import { useRoute } from "vue-router";
import { requestGroupDetail } from "@/api/modules/master";

const dialogVisible = ref(false);

const rules = reactive({
	avatar: [{ required: true, message: "请上传用户头像", trigger: "change" }],
	username: [{ required: true, message: "请填写用户姓名", trigger: "change" }],
	gender: [{ required: true, message: "请选择性别", trigger: "change" }],
	idCard: [{ required: true, message: "请填写身份证号", trigger: "change" }],
	email: [{ required: true, message: "请填写邮箱", trigger: "change" }],
	address: [{ required: true, message: "请填写居住地址", trigger: "change" }]
});

interface GroupDrawerProps {
	title: string;
	isView: boolean;
	rowData?: Master.CustomizeCreateRequest;
	apiUrl?: (params: any) => Promise<any>;
	getTableList?: () => Promise<any>;
}

const drawerData: GroupDrawerProps = reactive({
	isView: false,
	title: "",
	rowData: {} as Master.CustomizeCreateRequest
});

const ruleFormRef = ref<FormInstance>();
// 提交数据（新增/编辑）
const handleSubmit = () => {
	ruleFormRef.value!.validate(async valid => {
		if (!valid) return;
		try {
			await drawerData.apiUrl!(drawerData.rowData);
			ElMessage.success({ message: `${drawerData.title}用户成功！` });
			drawerData.getTableList!();
		} catch (error) {
			console.log(error);
		}
	});
};

// 公共校验方法（图片上传成功触发重新校验）
const checkValidate = (val: string) => {
	ruleFormRef.value!.validateField(val, () => {});
};

const route = useRoute();
const loading = ref(false);

onMounted(() => {
	const groupId = route.params.gid;
	if (groupId) {
		loading.value = true;
		requestGroupDetail({ groupId }).then((res: any) => {
			drawerData.rowData = res.data;
		});
	}
});
</script>
<style scoped>
.content-box {
	box-sizing: border-box;
	padding: 10px 20px 0 0;
}
.text-center {
	text-align: center;
}
</style>
