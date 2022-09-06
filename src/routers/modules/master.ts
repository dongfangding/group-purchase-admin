import { RouteRecordRaw } from "vue-router";
import { Layout } from "@/routers/constant";

// 我发起的 模块
const masterRouter: Array<RouteRecordRaw> = [
	{
		path: "/home",
		component: Layout,
		name: "home",
		redirect: "/home/index",
		meta: {
			title: "我发起的"
		},
		children: [
			{
				path: "/home/index",
				name: "master",
				component: () => import("@/views/master/index.vue"),
				meta: {
					keepAlive: true,
					requiresAuth: true,
					title: "我发起的",
					key: "index"
				}
			},
			{
				path: "/home/create",
				name: "Create",
				component: () => import("@/views/master/CreateGroup.vue"),
				meta: {
					keepAlive: true,
					requiresAuth: false,
					title: "创建团购",
					key: "Create"
				}
			},
			{
				path: "/home/create/:gid",
				name: "Edit",
				component: () => import("@/views/master/CreateGroup.vue"),
				meta: {
					keepAlive: true,
					requiresAuth: false,
					title: "编辑团购",
					key: "Edit"
				}
			},
			{
				path: "/home/detail/:gid",
				name: "Detail",
				component: () => import("@/views/marketplace/GroupDetail.vue"),
				meta: {
					keepAlive: true,
					requiresAuth: false,
					title: "团购详情",
					key: "Detail"
				}
			},
			{
				path: "/home/modifyPassword",
				name: "ModifyPassword",
				component: () => import("@/views/user/ModifyPassword.vue"),
				meta: {
					keepAlive: true,
					requiresAuth: false,
					title: "修改密码",
					key: "ModifyPassword"
				}
			}
			// {
			// 	path: "/home/embedded",
			// 	name: "embedded",
			// 	component: () => import("@/views/dashboard/embedded/index.vue"),
			// 	meta: {
			// 		keepAlive: true,
			// 		requiresAuth: false,
			// 		title: "内嵌页面",
			// 		key: "embedded"
			// 	}
			// }
		]
	}
];

export default masterRouter;
