import path from "node:path"
import { ShardingManager } from "discord.js"
import type { Logger } from "./classes/Logger"
import { env } from "./env"

export async function shardStart(logger: Logger): Promise<void> {
	const manager = new ShardingManager(path.join(__dirname, "Client.js"), {
		respawn: true,
		token: env.TOKEN,
		totalShards: "auto",
		shardList: "auto",
	})

	manager.on("shardCreate", (shard) => {
		shard.on("ready", () => {
			logger.start(`[CLIENT] Shard ${shard.id} connected to Discord's Gateway.`)
		})
		shard.on("disconnect", () => {
			logger.warn(`[CLIENT] Shard ${shard.id} disconnected.`)
		})
		shard.on("error", (error) => {
			logger.error(
				`[CLIENT] Shard ${shard.id} encountered an error: ${error.message}`,
			)
		})
	})

	try {
		await manager.spawn()
		logger.start(`[CLIENT] ${manager.totalShards} shard(s) spawned.`)
	} catch (error) {
		logger.error(`[CLIENT] Failed to spawn shards: ${(error as Error).message}`)
	}
}
