import { RouteRecordRaw } from "vue-router";
import { Layout } from "@/routers/constant";

// 订单 模块
const chatRouter: Array<RouteRecordRaw> = [
	{
		path: "/chat",
		component: Layout,
		redirect: "/chat/index",
		meta: {
			title: "信息"
		},
		children: [
			{
				path: "/chat/index",
				name: "ChatIndex",
				component: () => import("@/views/chat/chat.vue"),
				meta: {
					keepAlive: true,
					requiresAuth: true,
					title: "信息",
					key: "ChatIndex"
				}
			}
		]
	}
];

export default chatRouter;
