<template>
	<div :style="{ 'text-align': 'center', width: '40%' }">
		<el-form
			ref="passwordFormRef"
			:model="passwordForm"
			size="large"
			:rules="formRules"
			:label-position="labelPosition"
			label-width="80px"
			style="max-width: 460px"
		>
			<el-form-item prop="mobile" label="手机号">
				<el-input v-model="passwordForm.mobile"> </el-input>
			</el-form-item>
			<div :style="{ display: 'flex' }">
				<el-form-item prop="verifyCode" label="验证码" :style="{ width: '55%', flex: 1 }">
					<el-input
						type="text"
						v-model="passwordForm.verifyCode"
						placeholder="输入验证码"
						oninput="value=value.replace(/[^\d]/g,'')"
					>
					</el-input>
				</el-form-item>
				<el-button :style="{ 'margin-left': '2px' }" v-show="sendAuthCode" @click.prevent="getAuthCode">获取验证码</el-button>
				<span v-show="!sendAuthCode" class="auth_text">
					<span class="auth_text_blue">{{ auth_time }} </span>
					秒之后重新获取</span
				>
			</div>
			<el-form-item prop="password" label="密码">
				<el-input type="password" v-model="passwordForm.password"> </el-input>
			</el-form-item>
			<el-form-item prop="ensurePassword" label="确认密码">
				<el-input type="password" v-model="passwordForm.ensurePassword"> </el-input>
			</el-form-item>
		</el-form>

		<div :style="{ 'text-align': 'center' }">
			<el-button :icon="UserFilled" round @click="modify(passwordFormRef)" size="large" type="primary" :loading="loading">
				确认
			</el-button>
		</div>
		<div>
			<Verify
				@success="verifySuccess"
				mode="pop"
				captchaType="clickWord"
				:imgSize="{ width: '330px', height: '155px' }"
				ref="verifyDialog"
			></Verify>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { Common } from "@/api/interface";
import { UserFilled } from "@element-plus/icons-vue";
import type { ElForm } from "element-plus";
import { ElMessage } from "element-plus";
import { sendSmsCode } from "@/api/modules/login";
import { modifyPassword } from "@/api/modules/user";
import { useRouter } from "vue-router";
import Verify from "@/components/verifition/Verify.vue";

const router = useRouter();
const loading = ref<boolean>(false);
const labelPosition = ref("right");
type FormInstance = InstanceType<typeof ElForm>;
const passwordFormRef = ref<FormInstance>();
const formRules = reactive({
	mobile: [{ required: true, message: "请输入手机号", trigger: "blur" }],
	verifyCode: [{ required: true, message: "请输入验证码", trigger: "blur" }],
	password: [{ required: true, message: "请输入密码", trigger: "blur" }],
	ensurePassword: [{ required: true, message: "请输入确认", trigger: "blur" }]
});
// // 修改密码表单数据
const passwordForm = reactive<any>({
	mobile: "",
	verifyCode: "",
	password: "",
	ensurePassword: ""
});
// const logining = false;
let sendAuthCode = ref(true); //显示‘获取按钮'还是'倒计时'
let auth_time = ref(0); // 倒计时 计数器
// const credential = ""; //绑定输入验证码框
// 验证码弹出框组件
const verifyDialog = ref();
const uuid = ref();

// login
const modify = (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	formEl.validate(async valid => {
		if (!valid) return;
		try {
			const modifyRequest = {
				verifyCode: passwordForm.verifyCode,
				newPassword: passwordForm.ensurePassword,
				uuid: uuid.value
			};
			if (passwordForm.password != passwordForm.ensurePassword) {
				ElMessage.error("两次输入的密码不一致~");
				return;
			}
			await modifyPassword(modifyRequest);
			ElMessage.success("修改成功！");
			router.push({ name: "login" });
		} finally {
			loading.value = false;
		}
	});
};

// 打开验证码弹框
const openVerify = () => {
	verifyDialog.value.show();
};
// 发送短信验证码，打开验证码组件
const getAuthCode = async () => {
	if (passwordForm.mobile === "") {
		ElMessage.error("请先填写手机号");
		return;
	}
	openVerify();
};

// 验证码成功回调事件， 发送验证码
const verifySuccess = async (params: any) => {
	const smsRequest: Common.SendSmsCodeRequest = {
		mobile: passwordForm.mobile,
		captchaVerifyRequest: {
			uuid: params.uuid,
			verifyCode: params.verifyCode,
			captchaType: params.captchaType,
			captchaVerification: params.captchaVerification
		}
	};
	const res = await sendSmsCode(smsRequest);
	uuid.value = res.data!.uuid;
	sendAuthCode.value = false;
	//设置倒计时秒
	auth_time.value = 60;
	const auth_timetimer = setInterval(() => {
		auth_time.value--;
		if (auth_time.value <= 0) {
			sendAuthCode.value = true;
			clearInterval(auth_timetimer);
		}
	}, 1000);
};
</script>
<style scoped lang="scss">
.email_verify_status {
	font-size: 12px;
	color: red;
}
.auth_text {
	align-items: center;
	margin-top: 12px;
	margin-left: 5px;
	font-size: 14px !important;
	color: gray;
}
</style>
