<template>
	<el-dialog v-model="dialogVisible" title="个人资料" width="500px" draggable>
		<div :style="{ 'text-align': 'center' }">
			<el-form ref="personInfoFormRef" :model="personInfoForm" size="large" :label-position="labelPosition" label-width="60px">
				<el-form-item label="头像" prop="avatarUrl">
					<UploadImg v-model:file="personInfoForm.avatarUrl" :upload-style="{ width: '120px', height: '120px' }">
						<template #tip> 头像大小不能超过 3M </template>
					</UploadImg>
				</el-form-item>
				<el-form-item prop="nickname" label="昵称">
					<el-input v-model="personInfoForm.nickname"> </el-input>
				</el-form-item>
				<el-form-item prop="email" label="邮箱">
					<el-row>
						<el-col :span="12"><el-input v-model="personInfoForm.email"> </el-input></el-col>
						<el-col :span="8" :style="{ 'margin-left': '5px' }"
							><el-button
								@click.prevent="sendEmailVerifyFn"
								class="email_verify_status"
								v-show="!personInfoForm.emailVerified && personInfoForm.email"
								>不可使用，点击重新发送验证邮件</el-button
							></el-col
						>
					</el-row>
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
import { ref, toRef } from "vue";
import { UserInfo } from "@/api/interface";
import { UserFilled } from "@element-plus/icons-vue";
import UploadImg from "@/components/UploadImg/index.vue";
import { completeInfo, sendEmailVerify } from "@/api/modules/user";
import { GlobalStore } from "@/store";
const dialogVisible = ref(false);
const labelPosition = ref("right");
const globalStore = GlobalStore();

// 用户表单数据
let personInfoForm = toRef(globalStore, "userInfo");

// onMounted(() => {
// 	personalInfo().then(res => {
// 		personInfoForm.value = res.data || {};
// 	});
// });

// openDialog
const openDialog = () => {
	dialogVisible.value = true;
};
const edit = (form: UserInfo.PersonalInfoResponse) => {
	completeInfo(form);
};
const sendEmailVerifyFn = () => {
	sendEmailVerify({ email: personInfoForm.value.email });
};

defineExpose({
	openDialog
});
</script>
<style scoped lang="scss">
.email_verify_status {
	font-size: 12px;
	color: red;
}
</style>
