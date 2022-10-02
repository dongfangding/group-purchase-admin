import type { MqttClient, OnMessageCallback } from "mqtt";
import * as mqtt from "mqtt/dist/mqtt.min.js";
import { GlobalStore } from "@/store";
const globalStore = GlobalStore();

class MQTT {
	url: string; // mqtt地址
	topic: string; //订阅地址
	client!: MqttClient;
	constructor(topic: string) {
		this.topic = topic;
		// 虽然是mqtt但是在客户端这里必须采用websock的链接方式
		this.url = "ws://106.15.10.135:8809/mqtt";
	}

	//初始化mqtt
	init() {
		const options = {
			clean: true,
			reconnectPeriod: 1000,
			clientId: globalStore.userInfo.id + "-" + globalStore.userInfo.nickname,
			username: globalStore.userInfo.id,
			password: globalStore.token,
			connectTimeout: 4000 // 超时时间
		};
		this.client = mqtt.connect(this.url, options);
		this.client.on("error", (error: any) => {
			console.log(error);
		});
		this.client.on("reconnect", (error: Error) => {
			console.log(error);
		});
	}
	//取消订阅
	unsubscribes() {
		this.client.unsubscribe(this.topic, (error: Error) => {
			if (!error) {
				console.log(this.topic, "取消订阅成功");
			} else {
				console.log(this.topic, "取消订阅失败");
			}
		});
	}
	//连接
	link() {
		this.client.on("connect", () => {
			this.client.subscribe(this.topic, (error: any) => {
				if (!error) {
					console.log("订阅成功");
				} else {
					console.log("订阅失败");
				}
			});
		});
	}
	//收到的消息
	get(callback: OnMessageCallback) {
		this.client.on("message", callback);
	}
	//结束链接
	over() {
		this.client.end();
	}
}
export default MQTT;
