import { RouteRecordRaw } from "vue-router";
import { Layout } from "@/routers/constant";

// 订单 模块
const orderRouter: Array<RouteRecordRaw> = [
	{
		path: "/order",
		component: Layout,
		redirect: "/order/index",
		meta: {
			title: "订单"
		},
		children: [
			{
				path: "/order/index",
				name: "order",
				component: () => import("@/views/order/orderTab.vue"),
				meta: {
					keepAlive: true,
					requiresAuth: true,
					title: "我的跟团",
					key: "index"
				}
			}
		]
	}
];

export default orderRouter;
