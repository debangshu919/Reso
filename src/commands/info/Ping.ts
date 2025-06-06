import { Command, type Context, type Reso } from "../../classes/index"

export default class Ping extends Command {
	constructor(client: Reso) {
		super(client, {
			name: "ping",
			description: {
				content: "cmd.ping.description",
				usage: "ping",
				examples: ["ping"],
			},
			category: "general",
			aliases: ["pong"],
			cooldown: 3,
			args: false,
			vote: false,
			player: {
				voice: false,
				dj: false,
				active: false,
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
		const msg = await ctx.sendDeferMessage(ctx.locale("cmd.ping.content"))

		const botLatency = msg.createdTimestamp - ctx.createdTimestamp
		const apiLatency = Math.round(ctx.client.ws.ping)

		const botLatencySign = botLatency < 600 ? "+" : "-"
		const apiLatencySign = apiLatency < 500 ? "+" : "-"

		const embed = this.client
			.embed()
			.setAuthor({
				name: "Pong",
				iconURL: client.user?.displayAvatarURL(),
			})
			.setColor(this.client.color.main)
			.setFooter({
				text: ctx.locale("cmd.ping.requested_by", {
					author: ctx.author?.tag,
				}),
				iconURL: ctx.author?.displayAvatarURL({}),
			})
			.setTimestamp()

		if (ctx.isInteraction) {
			embed.addFields([
				{
					name: ctx.locale("cmd.ping.api_latency"),
					value: `\`\`\`diff\n${apiLatencySign} ${apiLatency}ms\n\`\`\``,
					inline: true,
				},
			])
		} else {
			embed.addFields([
				{
					name: ctx.locale("cmd.ping.bot_latency"),
					value: `\`\`\`diff\n${botLatencySign} ${botLatency}ms\n\`\`\``,
					inline: true,
				},
				{
					name: ctx.locale("cmd.ping.api_latency"),
					value: `\`\`\`diff\n${apiLatencySign} ${apiLatency}ms\n\`\`\``,
					inline: true,
				},
			])
		}

		return await ctx.editMessage({ content: "", embeds: [embed] })
	}
}
