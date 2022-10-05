import type { MqttClient, OnMessageCallback } from "mqtt";
import * as mqtt from "mqtt/dist/mqtt.min.js";
import { GlobalStore } from "@/store";
const globalStore = GlobalStore();

class MQTT {
	url: string; // mqtt地址
	client!: MqttClient;
	constructor(url: string) {
		// 虽然是mqtt但是在客户端这里必须采用websock的链接方式
		// this.url = "ws://106.15.10.135:8809/mqtt";
		this.url = url;
	}

	//初始化mqtt
	init() {
		const options = {
			clean: true,
			reconnectPeriod: 1000,
			clientId: globalStore.userInfo.id + "-" + globalStore.userInfo.nickname,
			// username: globalStore.userInfo.id,
			// password: 111,
			connectTimeout: 4000 // 超时时间
		};
		this.client = mqtt.connect(this.url, options);
		this.client.on("error", (error: any) => {
			console.log("mqtt错误事件...", error);
		});
		this.client.on("reconnect", (error: Error) => {
			if (!error) {
				console.log("mqtt重连成功....");
			} else {
				console.log("mqtt重连失败....");
			}
		});
		this.client.on("connect", packet => {
			console.log("mqtt连接成功....", packet);
		});
	}
	/**
	 * 是否已连接到服务器
	 */
	isConnected() {
		return this.client && this.client.connected == true;
	}

	/**
	 * 订阅主题
	 */
	subscribe(topic: string, qos: 0 | 1 | 2) {
		// if (this.isConnected()) {
		this.client.subscribe(topic, { qos: qos });
		console.log("mqtt订阅成功,topic = ", topic);
		// }
	}

	//取消订阅
	unsubscribe(topic: string) {
		this.client.unsubscribe(topic, (error: Error) => {
			if (!error) {
				console.log("取消订阅成功, topic = ", topic);
			} else {
				console.log("取消订阅失败, topic = ", topic, error);
			}
		});
	}
	//收到的消息
	get(callback: OnMessageCallback) {
		this.client.on("message", callback);
	}
	/**
	 * 推送数据
	 */
	publish(topic: string, message: string, qos: 0 | 1 | 2) {
		this.client.publish(topic, message, { qos: qos, retain: false });
	}
	//结束链接
	over() {
		this.client.end();
	}
}
export default MQTT;
