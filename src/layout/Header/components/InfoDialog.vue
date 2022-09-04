<template>
	<el-dialog v-model="dialogVisible" title="个人资料" width="500px" draggable>
		<div :style="{ 'text-align': 'center' }">
			<el-form ref="userFormRef" :model="userForm" size="large">
				<el-form-item label="头像" prop="avatarUrl">
					<UploadImg v-model:file="userForm.avatarUrl" :upload-style="{ width: '120px', height: '120px' }">
						<template #tip> 头像大小不能超过 3M </template>
					</UploadImg>
				</el-form-item>
				<el-form-item prop="nickname" label="昵称">
					<el-input v-model="userForm.nickname"> </el-input>
				</el-form-item>
				<el-form-item prop="email" label="邮箱">
					<el-input v-model="userForm.email"> </el-input>
				</el-form-item>
				<el-form-item prop="communityId" label="小区">
					<el-input v-model="userForm.communityId"> </el-input>
				</el-form-item>
				<el-form-item prop="buildingNo" label="楼栋号">
					<el-input v-model="userForm.buildingNo"> </el-input>
				</el-form-item>
				<el-form-item prop="roomNo" label="房间号">
					<el-input v-model="userForm.roomNo"> </el-input>
				</el-form-item>
			</el-form>
			<div :style="{ 'text-align': 'center' }">
				<el-button :icon="UserFilled" round @click="edit(userForm)" size="large" type="primary"> 确认 </el-button>
			</div>
		</div>
	</el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { UserInfo } from "@/api/interface";
import { UserFilled } from "@element-plus/icons-vue";
import UploadImg from "@/components/UploadImg/index.vue";
const dialogVisible = ref(false);

// 登录表单数据
const userForm = reactive<UserInfo.UserInfoForm>({
	communityId: 0,
	buildingNo: "",
	roomNo: "",
	nickname: "",
	avatarUrl: "",
	avatarThumbUrl: "",
	email: ""
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
