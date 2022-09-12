import { RouteRecordRaw } from "vue-router";
import { Layout } from "@/routers/constant";

// 团购市场 模块
const marketplaceRouter: Array<RouteRecordRaw> = [
	{
		path: "/marketplace",
		component: Layout,
		redirect: "/marketplace/index",
		meta: {
			title: "团购市场"
		},
		children: [
			{
				path: "/marketplace/index",
				name: "marketplace",
				component: () => import("@/views/marketplace/index.vue"),
				meta: {
					keepAlive: true,
					requiresAuth: true,
					title: "团购市场",
					key: "Marketplace"
				}
			}
		]
	}
];

export default marketplaceRouter;
