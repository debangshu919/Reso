import { Command, type Context, type Reso } from "../../classes/index"
import type { Requester } from "../../interfaces/Requester"

export default class Grab extends Command {
	constructor(client: Reso) {
		super(client, {
			name: "grab",
			description: {
				content: "cmd.grab.description",
				examples: ["grab"],
				usage: "grab",
			},
			category: "music",
			aliases: ["gr"],
			cooldown: 3,
			args: false,
			vote: false,
			player: {
				voice: false,
				dj: false,
				active: true,
				djPerm: null,
			},
			permissions: {
				dev: false,
				client: [
					"SendMessages",
					"ReadMessageHistory",
					"ViewChannel",
					"EmbedLinks",
				],
				user: [],
			},
			slashCommand: true,
			options: [],
		})
	}

	public async run(client: Reso, ctx: Context): Promise<any> {
		const player = client.manager.getPlayer(ctx.guild!.id)
		if (ctx.isInteraction)
			await ctx.sendDeferMessage(ctx.locale("cmd.grab.loading"))

		if (!player?.queue.current) {
			return await ctx.sendMessage({
				embeds: [
					this.client
						.embed()
						.setColor(this.client.color.red)
						.setDescription(ctx.locale("player.errors.no_song")),
				],
			})
		}

		const song = player.queue.current

		const songInfo = ctx.locale("cmd.grab.content", {
			title: song.info.title,
			uri: song.info.uri,
			artworkUrl: song.info.artworkUrl,
			length: song.info.isStream
				? "LIVE"
				: client.utils.formatTime(song.info.duration),
			requester: (song.requester as Requester).id,
		})

		try {
			await ctx.author?.send({
				embeds: [
					this.client
						.embed()
						.setTitle(`**${song.info.title}**`)
						.setURL(song.info.uri!)
						.setThumbnail(song.info.artworkUrl!)
						.setDescription(songInfo)
						.setColor(this.client.color.main),
				],
			})
			if (ctx.isInteraction) {
				return await ctx.editMessage({
					embeds: [
						this.client
							.embed()
							.setDescription(ctx.locale("cmd.grab.check_dm"))
							.setColor(this.client.color.green),
					],
				})
			}
			return await ctx.sendMessage({
				embeds: [
					this.client
						.embed()
						.setDescription(ctx.locale("cmd.grab.check_dm"))
						.setColor(this.client.color.green),
				],
			})
		} catch (_e) {
			if (ctx.isInteraction) {
				return await ctx.editMessage({
					embeds: [
						this.client
							.embed()
							.setDescription(ctx.locale("cmd.grab.dm_failed"))
							.setColor(this.client.color.red),
					],
				})
			}
			return await ctx.sendMessage({
				embeds: [
					this.client
						.embed()
						.setDescription(ctx.locale("cmd.grab.dm_failed"))
						.setColor(this.client.color.red),
				],
			})
		}
	}
}
