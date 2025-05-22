import fs from "node:fs"
import path from "node:path"
import type { Reso } from "../classes/index"

const pluginsFolder = path.join(process.cwd(), "dist", "plugin", "plugins")

export default async function loadPlugins(client: Reso): Promise<void> {
	try {
		const pluginFiles = fs
			.readdirSync(pluginsFolder)
			.filter((file) => file.endsWith(".js"))
		for (const file of pluginFiles) {
			const pluginPath = path.join(pluginsFolder, file)
			const { default: plugin } = require(pluginPath)
			if (plugin.initialize) plugin.initialize(client)
			client.logger.info(`Loaded plugin: ${plugin.name} v${plugin.version}`)
		}
	} catch (error) {
		client.logger.error("Error loading plugins:", error)
	}
}

export interface BotPlugin {
	name: string
	version: string
	author: string
	description?: string
	initialize: (client: Reso) => void
	shutdown?: (client: Reso) => void
}
