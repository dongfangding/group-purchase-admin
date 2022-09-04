<template>
	<el-dialog v-model="dialogVisible" title="个人资料" width="500px" draggable>
		<div :style="{ 'text-align': 'center' }">
			<el-form ref="personInfoFormRef" :model="personInfoForm" size="large">
				<el-form-item label="头像" prop="avatarUrl">
					<UploadImg v-model:file="personInfoForm.avatarUrl" :upload-style="{ width: '120px', height: '120px' }">
						<template #tip> 头像大小不能超过 3M </template>
					</UploadImg>
				</el-form-item>
				<el-form-item prop="nickname" label="昵称">
					<el-input v-model="personInfoForm.nickname"> </el-input>
				</el-form-item>
				<el-form-item prop="email" label="邮箱">
					<el-input v-model="personInfoForm.email"> </el-input>
				</el-form-item>
				<el-form-item prop="communityId" label="小区">
					<el-input v-model="personInfoForm.communityId"> </el-input>
				</el-form-item>
				<el-form-item prop="buildingNo" label="楼栋号">
					<el-input v-model="personInfoForm.buildingNo"> </el-input>
				</el-form-item>
				<el-form-item prop="roomNo" label="房间号">
					<el-input v-model="personInfoForm.roomNo"> </el-input>
				</el-form-item>
			</el-form>
			<div :style="{ 'text-align': 'center' }">
				<el-button :icon="UserFilled" round @click="edit(personInfoForm)" size="large" type="primary"> 确认 </el-button>
			</div>
		</div>
	</el-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { UserInfo } from "@/api/interface";
import { UserFilled } from "@element-plus/icons-vue";
import UploadImg from "@/components/UploadImg/index.vue";
import { personalInfo } from "@/api/modules/user";
const dialogVisible = ref(false);

// 登录表单数据
const personInfoForm = ref<any>();
// let personInfoForm = reactive<UserInfo.PersonalInfoResponse>({
// 	communityId: 0,
// 	buildingNo: "",
// 	roomNo: "",
// 	nickname: "",
// 	avatarUrl: "",
// 	avatarThumbUrl: "",
// 	email: ""
// });

onMounted(() => {
	personalInfo().then(res => {
		console.log(res);
		personInfoForm.value = res || {};
	});
});

// openDialog
const openDialog = () => {
	dialogVisible.value = true;
};
const edit = (form: UserInfo.UserInfoForm) => {
	console.log(form);
};

defineExpose({
	openDialog
});
</script>
