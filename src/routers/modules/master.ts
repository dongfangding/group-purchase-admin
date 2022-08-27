import { RouteRecordRaw } from "vue-router";
import { Layout } from "@/routers/constant";

// 我发起的 模块
const masterRouter: Array<RouteRecordRaw> = [
	{
		path: "/master",
		component: Layout,
		redirect: "/master/index",
		meta: {
			title: "我发起的"
		},
		children: [
			{
				path: "/master/index",
				name: "index",
				component: () => import("@/views/master/index.vue"),
				meta: {
					keepAlive: true,
					requiresAuth: true,
					title: "我发起的",
					key: "index"
				}
			},
			{
				path: "/master/embedded",
				name: "embedded",
				component: () => import("@/views/dashboard/embedded/index.vue"),
				meta: {
					keepAlive: true,
					requiresAuth: true,
					title: "内嵌页面",
					key: "embedded"
				}
			}
		]
	}
];

export default masterRouter;
