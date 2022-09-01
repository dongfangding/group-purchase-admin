<template>
	<el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" size="large">
		<el-form-item prop="loginIdentity" v-if="props.loginType === 'PASSWORD'">
			<el-input v-model="loginForm.loginIdentity" placeholder="请输入用户名">
				<template #prefix>
					<el-icon class="el-input__icon"><user /></el-icon>
				</template>
			</el-input>
		</el-form-item>
		<el-form-item prop="credential" v-if="props.loginType === 'PASSWORD'">
			<el-input type="password" v-model="loginForm.credential" placeholder="请输入密码" show-password autocomplete="new-password">
				<template #prefix>
					<el-icon class="el-input__icon"><lock /></el-icon>
				</template>
			</el-input>
		</el-form-item>
		<el-form-item prop="loginIdentity" v-if="props.loginType === 'SMS_CODE'">
			<el-input v-model="loginForm.loginIdentity" placeholder="请输入手机号">
				<template #prefix>
					<el-icon class="el-input__icon"><user /></el-icon>
				</template>
			</el-input>
		</el-form-item>
		<div :style="{ display: 'flex' }" v-if="props.loginType === 'SMS_CODE'">
			<el-form-item prop="credential" :style="{ width: '55%', flex: 1 }">
				<el-input type="text" v-model="loginForm.credential" placeholder="输入验证码" oninput="value=value.replace(/[^\d]/g,'')">
				</el-input>
			</el-form-item>
			<el-button :style="{ 'margin-left': '2px' }" v-show="sendAuthCode" @click.prevent="getAuthCode">获取验证码</el-button>
			<span v-show="!sendAuthCode" class="auth_text">
				<span class="auth_text_blue">{{ auth_time }} </span>
				秒之后重新发送验证码</span
			>
		</div>
	</el-form>
	<div class="login-btn">
		<el-button :icon="CircleClose" round @click="resetForm(loginFormRef)" size="large">重置</el-button>
		<el-button :icon="UserFilled" round @click="login(loginFormRef)" size="large" type="primary" :loading="loading">
			登录
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
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import { Login, Common } from "@/api/interface";
import { CircleClose, UserFilled } from "@element-plus/icons-vue";
import type { ElForm } from "element-plus";
import { ElMessage } from "element-plus";
import { loginApi, sendSmsCode } from "@/api/modules/login";
import { GlobalStore } from "@/store";
import { MenuStore } from "@/store/modules/menu";
import { TabsStore } from "@/store/modules/tabs";
//引入组件
import Verify from "@/components/verifition/Verify.vue";
// import md5 from "js-md5";

const globalStore = GlobalStore();
const menuStore = MenuStore();
const tabStore = TabsStore();
// 验证码弹出框组件
const verifyDialog = ref();
const uuid = ref();

// const logining = false;
const sendAuthCode = true; //显示‘获取按钮'还是'倒计时'
const auth_time = 0; // 倒计时 计数器
// const credential = ""; //绑定输入验证码框

// 接收父组件传过来的值
const props = defineProps({
	loginType: {
		type: String,
		default: () => "mobileLogin"
	}
});

// 打开验证码弹框
const openVerify = () => {
	verifyDialog.value.show();
};

// 验证码成功回调事件， 发送验证码
const verifySuccess = async (params: any) => {
	const smsRequest: Common.SendSmsCodeRequest = {
		mobile: loginForm.loginIdentity,
		captchaVerifyRequest: {
			uuid: params.uuid,
			verifyCode: params.verifyCode,
			captchaType: params.captchaType,
			captchaVerification: params.captchaVerification
		}
	};
	const res = await sendSmsCode(smsRequest);
	uuid.value = res.data!.uuid;
};

// 定义 formRef（校验规则）
type FormInstance = InstanceType<typeof ElForm>;
const loginFormRef = ref<FormInstance>();
const loginRules = reactive({
	loginIdentity: [{ required: true, message: "请输入用户名", trigger: "blur" }],
	credential: [{ required: true, message: "请输入密码", trigger: "blur" }]
});

// 登录表单数据
const loginForm = reactive<Login.ReqLoginForm>({
	loginIdentity: "",
	credential: "",
	loginType: "",
	uuid: ""
});

const loading = ref<boolean>(false);
const router = useRouter();

// 发送短信验证码，打开验证码组件
const getAuthCode = async () => {
	if (loginForm.loginIdentity === "") {
		ElMessage.error("请先填写手机号");
		return;
	}
	openVerify();
	// await createFromWxJieLong({ text: ref(wxText).value });
	// importDialogVisible.value = false;
	// proTable.value.refresh();
};

// login
const login = (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	formEl.validate(async valid => {
		if (!valid) return;
		loading.value = true;
		try {
			const requestLoginForm: Login.ReqLoginForm = {
				loginIdentity: loginForm.loginIdentity,
				credential: loginForm.credential,
				loginType: props.loginType,
				uuid: uuid.value
				// credential: md5(loginForm.password)
			};
			const res = await loginApi(requestLoginForm);
			// * 存储 token
			globalStore.setToken(res.data!.token);
			// * 登录成功之后清除上个账号的 menulist 和 tabs 数据
			menuStore.setMenuList([]);
			tabStore.closeMultipleTab();

			ElMessage.success("登录成功！");
			router.push({ name: "home" });
		} finally {
			loading.value = false;
		}
	});
};

// resetForm
const resetForm = (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	formEl.resetFields();
};

onMounted(() => {
	// 监听enter事件（调用登录）
	document.onkeydown = (e: any) => {
		e = window.event || e;
		if (e.code === "Enter" || e.code === "enter" || e.code === "NumpadEnter") {
			if (loading.value) return;
			login(loginFormRef.value);
		}
	};
});
</script>

<style scoped lang="scss">
@import "../index.scss";
</style>
