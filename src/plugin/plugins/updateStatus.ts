import type { Reso } from "../../classes/index"
import type { BotPlugin } from "../index"

const updateStatusPlugin: BotPlugin = {
	name: "Update Status Plugin",
	version: "1.0.0",
	author: "debangshu919",
	initialize: (client: Reso) => {
		client.on("ready", () => client.utils.updateStatus(client))
	},
}

export default updateStatusPlugin
