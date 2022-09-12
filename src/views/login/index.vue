<template>
	<div class="table-box">
		<div>
			<div class="login-container flx-center">
				<SwitchDark class="dark" />
				<div class="login-box">
					<div class="login-left">
						<img src="@/assets/images/login_left0.png" alt="login" />
					</div>
					<div class="login-form">
						<div class="login-logo">
							<img class="login-icon" src="@/assets/images/logo.svg" alt="" />
							<h2 class="logo-text">团购吧</h2>
						</div>
						<el-tabs v-model="activeName" class="demo-tabs">
							<el-tab-pane label="密码登录" name="passwordLogin"><LoginForm ref="loginRef" loginType="PASSWORD" /></el-tab-pane>
							<el-tab-pane label="手机号登录" name="mobileLogin"><LoginForm ref="loginRef" loginType="SMS_CODE" /></el-tab-pane>
						</el-tabs>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts" name="login">
import SwitchDark from "@/components/SwitchDark/index.vue";
import LoginForm from "./components/LoginForm.vue";
import { ref } from "vue";

const activeName = ref("passwordLogin");
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
