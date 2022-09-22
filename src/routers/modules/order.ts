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
				name: "OrderIndex",
				component: () => import("@/views/order/orderTab.vue"),
				meta: {
					keepAlive: true,
					requiresAuth: true,
					title: "我的跟团",
					key: "OrderIndex"
				}
			},
			{
				path: "/order/pay",
				name: "OrderPay",
				component: () => import("@/views/order/pay.vue"),
				meta: {
					keepAlive: false,
					requiresAuth: false,
					title: "支付",
					key: "OrderPay"
				}
			},
			{
				path: "/order/detail/:joinItemId",
				name: "OrderDetail",
				component: () => import("@/views/order/OrderDetail.vue"),
				meta: {
					keepAlive: false,
					requiresAuth: false,
					title: "订单详情",
					key: "OrderDetail"
				}
			}
		]
	}
];

export default orderRouter;
