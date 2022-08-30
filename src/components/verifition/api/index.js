/**
 * 此处可直接引用自己项目封装好的 axios 配合后端联调
 */

import http from "@/api";
import { PORT1 } from "@/api/config/servicePort";

// 获取验证图片  以及token
export function reqGet(params) {
	return http.post(PORT1 + `/common/generateCaptcha`, params);
}

// 滑动或者点选验证
export function reqCheck(params) {
	return http.post(PORT1 + `/common/checkCaptcha`, params);
}
