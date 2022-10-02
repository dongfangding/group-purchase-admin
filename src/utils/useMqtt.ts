import MQTT from "@/utils/mqtt";
import { ref, onUnmounted } from "vue";
import type { OnMessageCallback } from "mqtt";
import { getConnectionInfo } from "@/api/modules/chat";

export default function useMqtt() {
	const PublicMqtt = ref<MQTT | null>(null);
	getConnectionInfo();
	const startMqtt = (topic: string, callback: OnMessageCallback) => {
		// 设置订阅地址
		PublicMqtt.value = new MQTT(topic);
		// 初始化mqtt
		PublicMqtt.value.init();
		// 链接mqtt
		PublicMqtt.value.link();
		getMessage(callback);
	};
	const getMessage = (callback: OnMessageCallback) => {
		// PublicMqtt.value?.client.on('message', callback);
		PublicMqtt.value?.get(callback);
	};
	onUnmounted(() => {
		// 页面销毁结束订阅
		if (PublicMqtt.value) {
			PublicMqtt.value.unsubscribes();
			PublicMqtt.value.over();
		}
	});

	return {
		startMqtt
	};
}
