import { Command, type Context, type Reso } from "../../classes/index"

export default class ClearQueue extends Command {
	constructor(client: Reso) {
		super(client, {
			name: "clearqueue",
			description: {
				content: "cmd.clearqueue.description",
				examples: ["clearqueue"],
				usage: "clearqueue",
			},
			category: "music",
			aliases: ["cq"],
			cooldown: 3,
			args: false,
			vote: false,
			player: {
				voice: true,
				dj: true,
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
		const embed = this.client.embed()

		if (!player) {
			return await ctx.sendMessage({
				embeds: [
					embed
						.setColor(this.client.color.red)
						.setDescription(ctx.locale("player.errors.no_player")),
				],
			})
		}

		if (player.queue.tracks.length === 0) {
			return await ctx.sendMessage({
				embeds: [
					embed
						.setColor(this.client.color.red)
						.setDescription(ctx.locale("player.errors.no_song")),
				],
			})
		}

		player.queue.tracks.splice(0, player.queue.tracks.length)
		return await ctx.sendMessage({
			embeds: [
				embed
					.setColor(this.client.color.main)
					.setDescription(ctx.locale("cmd.clearqueue.messages.cleared")),
			],
		})
	}
}
