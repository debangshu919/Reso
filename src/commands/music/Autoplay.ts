import { Command, type Context, type Reso } from "../../classes/index"

export default class Autoplay extends Command {
	constructor(client: Reso) {
		super(client, {
			name: "autoplay",
			description: {
				content: "cmd.autoplay.description",
				examples: ["autoplay"],
				usage: "autoplay",
			},
			category: "music",
			aliases: ["ap"],
			cooldown: 3,
			args: false,
			vote: true,
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
		if (!player) {
			return await ctx.sendMessage({
				embeds: [
					{
						description: ctx.locale("player.errors.no_player"),
						color: this.client.color.red,
					},
				],
			})
		}

		const embed = this.client.embed()
		const autoplay = player.get<boolean>("autoplay")

		player.set("autoplay", !autoplay)

		if (autoplay) {
			embed
				.setDescription(ctx.locale("cmd.autoplay.messages.disabled"))
				.setColor(this.client.color.main)
		} else {
			embed
				.setDescription(ctx.locale("cmd.autoplay.messages.enabled"))
				.setColor(this.client.color.main)
		}

		await ctx.sendMessage({ embeds: [embed] })
	}
}
