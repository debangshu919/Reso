import { Command, type Context, type Reso } from "../../classes/index"

export default class Stop extends Command {
	constructor(client: Reso) {
		super(client, {
			name: "stop",
			description: {
				content: "cmd.stop.description",
				examples: ["stop"],
				usage: "stop",
			},
			category: "music",
			aliases: ["sp"],
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
		if (!player)
			return await ctx.sendMessage(ctx.locale("event.message.no_music_playing"))
		player.stopPlaying(true, false)

		return await ctx.sendMessage({
			embeds: [
				embed
					.setColor(this.client.color.main)
					.setDescription(ctx.locale("cmd.stop.messages.stopped")),
			],
		})
	}
}
