import { PORT1 } from "@/api/config/servicePort";

import http from "@/api";

/**
 * @name 团购市场
 */
export const getConnectionInfo = () => {
	// mqtt_tcp mqtt_ws mqtt_wss
	return http.get(PORT1 + `/emq/module/getConnectionInfo?protocol=mqtt_tcp`);
};
