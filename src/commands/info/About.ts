import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js"
import { version } from "../../../package.json"
import { Command, type Context, type Reso } from "../../classes/index"
import { getFormattedUptime } from "../../utils/functions/UptimeTracker"

export default class About extends Command {
	constructor(client: Reso) {
		super(client, {
			name: "about",
			description: {
				content: "cmd.about.description",
				examples: ["about"],
				usage: "about",
			},
			category: "info",
			aliases: ["ab"],
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
		const inviteButton = new ButtonBuilder()
			.setLabel(ctx.locale("buttons.invite"))
			.setStyle(ButtonStyle.Link)
			.setURL(
				`https://discord.com/api/oauth2/authorize?client_id=${client.env.CLIENT_ID}&permissions=35323995614529&scope=bot%20applications.commands`,
			)
		const supportButton = new ButtonBuilder()
			.setLabel(ctx.locale("buttons.support"))
			.setStyle(ButtonStyle.Link)
			.setURL("https://discord.gg/YUFvu5hgFP")
		const commandButton = new ButtonBuilder()
			.setLabel(ctx.locale("buttons.commands"))
			.setStyle(ButtonStyle.Link)
			.setURL("https://resobot.live/commands")
		const websiteButton = new ButtonBuilder()
			.setLabel(ctx.locale("buttons.website"))
			.setStyle(ButtonStyle.Link)
			.setURL("https://resobot.live")
		const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
			inviteButton,
			supportButton,
		)

		// Get the current bot uptime
		const uptime = getFormattedUptime()

		// Get the server count
		const serverCount = client.guilds.cache.size

		// Get bot ping
		const ping = client.ws.ping

		const embed = this.client
			.embed()
			.setAuthor({
				name: "Reso",
				iconURL:
					"https://media.discordapp.net/attachments/1356507997597208636/1356508050693029968/Untitled_logo_1_free-file_2.jpg?ex=67ecd211&is=67eb8091&hm=6ba3dd773cb76b3c91d635f56cccd3affce5521e45b84cabf86eec21011b35f6&=&format=webp",
			})
			.setThumbnail(
				"https://media.discordapp.net/attachments/1356507997597208636/1356508050693029968/Untitled_logo_1_free-file_2.jpg?ex=67ef7511&is=67ee2391&hm=645aac285e2f54ffb715c9bba3a6ca361e31ce083a91ec35fd75660c9994d0df&=&format=webp",
			)
			.setColor(this.client.color.main)
			.addFields(
				{
					name: "\u200b",
					value: ctx.locale("cmd.about.fields.description"),
					inline: false,
				},
				{
					name: "\u200b",
					value: "\u200b",
					inline: false,
				},
				{
					name: ctx.locale("cmd.about.fields.version"),
					value: `v${version}`,
					inline: true,
				},
				{
					name: ctx.locale("cmd.about.fields.ping"),
					value: `${ping}ms`,
					inline: true,
				},
				{
					name: ctx.locale("cmd.about.fields.uptime"),
					value: uptime,
					inline: true,
				},
				{
					name: ctx.locale("cmd.about.fields.servers"),
					value: serverCount.toString(),
					inline: true,
				},
				{
					name: ctx.locale("cmd.about.fields.creator"),
					value:
						"[chromavisionmusic](https://discord.com/users/1063860912173359114)",
					inline: true,
				},
				{
					name: ctx.locale("cmd.about.fields.support"),
					value: "[Reso Labs](https://discord.gg/YUFvu5hgFP)",
					inline: true,
				},
			)
			.setFooter({
				text: "Made with ❤️ using discord.js and lavalink-client",
				iconURL:
					"https://media.discordapp.net/attachments/1356507997597208636/1357424718881226895/typescript.png?ex=67f027c8&is=67eed648&hm=b343f3311094a843c1f033ee33d9ce18cdf7bb139ca547a4b12418bfc78784de&=&format=webp&quality=lossless",
			})
		await ctx.sendMessage({
			content: "",
			embeds: [embed],
			components: [row],
		})
	}
}
