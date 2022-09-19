import { ResPage, User, UserInfo } from "@/api/interface/index";
import { PORT1 } from "@/api/config/servicePort";

import http from "@/api";

/**
 * @name 用户管理模块
 */
// * 获取用户列表
export const getUserList = (params: User.ReqGetUserParams) => {
	return http.post<ResPage<User.ResUserList>>(PORT1 + `/user/list`, params);
};

// * 新增用户
export const addUser = (params: { id: string }) => {
	return http.post(PORT1 + `/user/add`, params);
};

// * 批量添加用户
export const BatchAddUser = (params: FormData) => {
	return http.post(PORT1 + `/user/import`, params);
};

// * 编辑用户
export const editUser = (params: { id: string }) => {
	return http.post(PORT1 + `/user/edit`, params);
};

// * 删除用户
export const deleteUser = (params: { id: string[] }) => {
	return http.post(PORT1 + `/user/delete`, params);
};

// * 切换用户状态
export const changeUserStatus = (params: { id: string; status: number }) => {
	return http.post(PORT1 + `/user/change`, params);
};

// * 重置用户密码
export const resetUserPassWord = (params: { id: string }) => {
	return http.post(PORT1 + `/user/rest_password`, params);
};

// * 导出用户数据
export const exportUserInfo = (params: User.ReqGetUserParams) => {
	return http.post<BlobPart>(PORT1 + `/user/export`, params, { responseType: "blob" });
};

// * 获取用户状态
export const getUserStatus = () => {
	return http.get<User.ResStatus>(PORT1 + `/user/status`);
};

// * 获取用户性别字典
export const getUserGender = () => {
	return http.get<User.ResGender>(PORT1 + `/user/gender`);
};

/**
 * 个人中心
 * @returns
 */
export const personalInfo = () => {
	return http.get<UserInfo.PersonalInfoResponse>(PORT1 + `/userInfo/personalInfo`);
};

/**
 * 完善个人信息
 * @returns
 */
export const completeInfo = (params: UserInfo.PersonalInfoResponse) => {
	return http.post<UserInfo.PersonalInfoResponse>(PORT1 + `/userInfo/completeInfo`, params);
};

/**
 * 单独发送邮箱验证邮件
 * @returns
 */
export const sendEmailVerify = (params: UserInfo.EmailVerifyRequest) => {
	return http.post(PORT1 + `/userInfo/sendEmailVerify`, params);
};

/**
 * 修改密码
 * @returns
 */
export const modifyPassword = (params: any) => {
	return http.post(PORT1 + `/userInfo/modifyPassword`, params);
};

/**
 * 用户收货地址列表
 * @returns
 */
export const userAddressList = () => {
	return http.get(PORT1 + `/userInfo/address/all`);
};

/**
 * 新增或修改收货地址
 * @returns
 */
export const modifyUserAddress = (params: any) => {
	return http.post(PORT1 + `/userInfo/address/saveOrUpdate`, params);
};

/**
 * 获取用户默认收货地址
 * @returns
 */
export const defaultUserAddress = () => {
	return http.get(PORT1 + `/userInfo/address/default`);
};

/**
 * 删除用户收货地址
 * @returns
 */
export const deleteUserAddress = (id: any) => {
	return http.post(PORT1 + `/userInfo/address/delete?id=` + id);
};
