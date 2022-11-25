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
					:file-size="5"
					:upload-style="{ width: '120px', height: '120px' }"
				>
					<template #tip> 大小不能超过 5M </template>
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
			<el-form-item label="商品图片" prop="goodPic">
				<UploadImg
					v-model:file="drawerData.rowData!.goodPic"
					:disabled="drawerData.isView"
					:file-size="5"
					:upload-style="{ width: '120px', height: '120px' }"
					@check-validate="checkValidate('wxIdCardUrl')"
				>
					<template #tip> 大小不能超过 5M </template>
				</UploadImg>
			</el-form-item>
			<el-form-item label="商品单价" prop="price">
				<el-input type="number" v-model="drawerData.rowData!.price" placeholder="请填写商品单价" clearable></el-input>
			</el-form-item>
			<el-form-item label="商品规格" prop="specification">
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
				<el-button @click="$router.replace('/home/index')">取消</el-button>
				<el-button type="primary" v-show="!drawerData.isView" @click="handleSubmit(0)">暂存</el-button>
				<el-button type="primary" v-show="!drawerData.rowData.publicFlag" @click="handleSubmit(1)">发布成团</el-button>
			</el-form-item>
		</el-form>
		<el-dialog v-model="dialogVisible" title="富文本内容预览" width="1300px" top="50px">
			<div class="view" v-html="drawerData.rowData!.content"></div>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="UserDrawer">
import { ref, reactive, onMounted } from "vue";
import { ElMessage, FormInstance } from "element-plus";
import UploadImg from "@/components/UploadImg/index.vue";
import WangEditor from "@/components/WangEditor/index.vue";
import { useRoute } from "vue-router";
import { requestGroupDetail } from "@/api/modules/master";
import { customizeCreate, modifyGroupInfo } from "@/api/modules/master";
import { useRouter } from "vue-router";

const route = useRoute();
const loading = ref(false);
const router = useRouter();
const dialogVisible = ref(false);
const groupId = ref();

const rules = reactive({});

interface GroupDrawerProps {
	title: string;
	isView: boolean;
	rowData?: any;
	apiUrl?: (params: any) => Promise<any>;
	getTableList?: () => Promise<any>;
}

const drawerData: GroupDrawerProps = reactive({
	isView: false,
	title: "",
	rowData: {} as any
});

const ruleFormRef = ref<FormInstance>();
// 提交数据（新增/编辑）
const handleSubmit = (type: number) => {
	ruleFormRef.value!.validate(async valid => {
		if (!valid) return;
		try {
			if (type === 1) {
				drawerData.rowData["publicFlag"] = true;
				drawerData.rowData.joinItems = [];
			}
			if (groupId.value && groupId.value != 0) {
				await modifyGroupInfo(drawerData.rowData);
			} else {
				await customizeCreate(drawerData.rowData);
			}
			ElMessage.success({ message: `成功` });
			refreshDetails(groupId.value);
			router.replace("/home/index");
		} catch (error) {
			router.replace("/home/index");
		}
	});
};

// 公共校验方法（图片上传成功触发重新校验）
const checkValidate = (val: string) => {
	ruleFormRef.value!.validateField(val, () => {});
};

// 重新加载明细
const refreshDetails = (groupId: any) => {
	if (!groupId || groupId == 0) return;
	requestGroupDetail({ groupId }).then((res: any) => {
		drawerData.rowData = res.data;
	});
};

onMounted(() => {
	groupId.value = route.params.gid;
	if (groupId.value) {
		loading.value = true;
		refreshDetails(groupId.value);
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
.affix-container {
	height: 400px;
	text-align: center;
	background: var(--el-color-primary-light-9);
	border-radius: 4px;
}
</style>
