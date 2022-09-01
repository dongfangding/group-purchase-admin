// * 请求响应参数(不包含data)
export interface Result {
	code: string;
	message: string;
	stack: string;
	extra: object;
	timestamp: number;
}

// * 请求响应参数(包含data)
export interface ResultData<T = any> extends Result {
	data?: T;
}

// * 分页响应参数
export interface ResPage<T> {
	datalist: T[];
	pageNum: number;
	pageSize: number;
	total: number;
}

// * 分页请求参数
export interface ReqPage {
	pageNum: number;
	pageSize: number;
}

// * 登录模块
export namespace Login {
	export interface ReqLoginForm {
		loginIdentity: string;
		credential: string;
		loginType: string;
		uuid: string;
	}
	export interface ResLogin {
		token: string;
	}
	export interface ResAuthButtons {
		[propName: string]: any;
	}
}

// * 用户管理模块
export namespace User {
	export interface ReqGetUserParams extends ReqPage {
		username: string;
		gender: number;
		idCard: string;
		email: string;
		address: string;
		createTime: string[];
		status: number;
	}
	export interface ResUserList {
		id: string;
		username: string;
		gender: string;
		age: number;
		idCard: string;
		email: string;
		address: string;
		createTime: string;
		status: number;
		avatar: string;
		children?: ResUserList[];
	}
	export interface ResStatus {
		userLabel: string;
		userValue: number;
	}
	export interface ResGender {
		genderLabel: string;
		genderValue: number;
	}
}

// * 文件上传模块
export namespace Upload {
	export interface UploadResponse {
		group: string; // 组
		path: string; // 路径
		fullPath: string; // 全路径(group + path)
		thumbPath: string; // 生成的缩略图路径
		accessFullPath: string; // 带域名的可访问的全路径地址
	}
}

// * 我发起的团购
export namespace Master {
	export interface MyInitiatedGroupPageRequest extends ReqPage {
		groupName: string;
		status: string;
		ctimeBegin: number;
		ctimeEnd: number;
	}
	export interface CreateFromWxJieLongRequest {
		text: string;
	}
	export interface CustomizeCreateRequest {
		name: string;
		content: string;
		publicFlag: boolean;
		wxIdCardUrl: string;
		picUrls: string;
		videoUrl: string;
		startTime: number;
		endTime: number;
		goodName: string;
		goodDescription: string;
		price: number;
		stock: number;
		limitType: string;
		limitValue: number;
	}
	export interface ModifyGroupRequest extends CustomizeCreateRequest {
		id: number;
	}
	export interface UpdateGroupStatusRequest {
		id: number;
		status: string;
	}
	export interface PublishGroupRequest {
		id: number;
		publicFlag: boolean;
	}
	export interface List {
		id: number;
		name: string;
		content: string;
		publicFlag: boolean;
		wxIdCardUrl: string;
		picUrls: string;
		videoUrl: string;
		startTime: number;
		endTime: number;
		goodName: string;
		goodDescription: string;
		price: number;
		stock: number;
		limitType: string;
		limitValue: number;
	}
	export interface MarketplaceList extends List {
		groupMasterName: string;
		groupMasterAvatarUrl: string;
	}
}

/**
 * 通用模块
 */
export namespace Common {
	// 获取验证码请求
	export interface VerifyCodeReq {
		captchaType: string; // 验证码类型TEXT 文本， MATH计算 CLICK_WORDS点选文字，PIC_SLIDE滑动图片
	}
	// 获取验证码响应
	export interface VerifyCodeRes {
		width: number;
		height: number;
		originalImageBase64: string;
		imageBase64: string;
		wordList: Array<string>;
		uuid: string;
		prefix: string;
	}
	// 验证码校验参数
	export interface CaptchaVerifyRequest {
		uuid: string;
		verifyCode: string;
		captchaType: string;
		captchaVerification: string; // 后台二次校验参数
	}
	// 发送短信验证码
	export interface SendSmsCodeRequest {
		mobile: string;
		captchaVerifyRequest: CaptchaVerifyRequest;
	}
	// 发送短信验证码响应
	export interface ApplicationSmsSendResponse {
		uuid: string;
	}
}
