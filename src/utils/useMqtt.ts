import MQTT from "@/utils/mqtt";
import type { OnMessageCallback } from "mqtt";
import { getConnectionInfo } from "@/api/modules/chat";

const globalMqttClient = new MQTT("ws://106.15.10.135:8809/mqtt");
// 初始化mqtt
globalMqttClient.init();
console.log("初始化mqtt....");
await getConnectionInfo();
export default function useMqtt() {
	const subscribe = (topic: string, callback: OnMessageCallback) => {
		globalMqttClient.subscribe(topic, 0);
		getMessage(callback);
	};
	const getMessage = (callback: OnMessageCallback) => {
		// PublicMqtt.value?.client.on('message', callback);
		globalMqttClient?.get(callback);
	};

	const unsubscribe = (topic: string) => {
		globalMqttClient?.unsubscribe(topic);
	};

	return {
		subscribe,
		unsubscribe
	};
}
