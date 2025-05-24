import {
	ActionRowBuilder,
	ButtonBuilder,
	type ButtonInteraction,
	ButtonStyle,
	ComponentType,
	type TextChannel,
} from "discord.js"
import { Client as GeniusClient } from "genius-lyrics"
import { Command, type Context, type Reso } from "../../classes/index"

export default class Lyrics extends Command {
	private genius: GeniusClient

	private cleanLyrics(lyrics: string): string {
		// Remove contributor lines
		let cleaned = lyrics.replace(/^\d+\s*Contributors.*$/m, "")

		// Remove song title with "Lyric" at the end
		cleaned = cleaned.replace(/^.*?Lyric\s*$/m, "")

		// Remove [Verse], [Chorus], etc.
		cleaned = cleaned.replace(/\[.*?\]/g, "")

		// Remove "Lyrics" or "Lyrics for" at the start
		cleaned = cleaned.replace(/^(?:Lyrics|Lyrics for|Lyrics of).*?\n/i, "")

		// Remove "Embed" text that sometimes appears
		cleaned = cleaned.replace(/Embed$/i, "")

		// Remove extra newlines
		cleaned = cleaned.replace(/\n{3,}/g, "\n\n")

		// Trim whitespace
		cleaned = cleaned.trim()

		return cleaned
	}
	constructor(client: Reso) {
		super(client, {
			name: "lyrics",
			description: {
				content: "cmd.lyrics.description",
				examples: ["lyrics"],
				usage: "lyrics",
			},
			category: "music",
			aliases: ["ly"],
			cooldown: 3,
			args: false,
			vote: false,
			player: {
				voice: true,
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
		this.genius = new GeniusClient(client.env.GENIUS_API)
	}

	public async run(client: Reso, ctx: Context): Promise<any> {
		const player = client.manager.getPlayer(ctx.guild!.id)
		if (!player)
			return await ctx.sendMessage(ctx.locale("event.message.no_music_playing"))
		const embed = this.client.embed()

		const track = player.queue.current!
		const trackTitle = track.info.title.replace(/\[.*?\]/g, "").trim()
		const artistName = track.info.author.replace(/\[.*?\]/g, "").trim()
		const trackUrl = track.info.uri
		const artworkUrl = track.info.artworkUrl

		await ctx.sendDeferMessage(
			ctx.locale("cmd.lyrics.searching", { trackTitle }),
		)

		try {
			const searches = await this.genius.songs.search(
				`${trackTitle} ${artistName}`,
			)
			const song = searches[0]

			if (!song) {
				return await ctx.editMessage({
					embeds: [
						embed
							.setColor(client.color.red)
							.setDescription(ctx.locale("cmd.lyrics.errors.no_results")),
					],
				})
			}

			const lyrics = await song.lyrics()
			const cleanedLyrics = this.cleanLyrics(lyrics)
			if (cleanedLyrics) {
				const lyricsPages = this.paginateLyrics(cleanedLyrics)
				let currentPage = 0

				const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
					new ButtonBuilder()
						.setCustomId("prev")
						.setEmoji(this.client.emoji.page.back)
						.setStyle(ButtonStyle.Secondary)
						.setDisabled(true),
					new ButtonBuilder()
						.setCustomId("stop")
						.setEmoji(this.client.emoji.page.cancel)
						.setStyle(ButtonStyle.Danger),
					new ButtonBuilder()
						.setCustomId("next")
						.setEmoji(this.client.emoji.page.next)
						.setStyle(ButtonStyle.Secondary)
						.setDisabled(lyricsPages.length <= 1),
				)

				await ctx.editMessage({
					embeds: [
						embed
							.setColor(client.color.main)
							.setDescription(
								ctx.locale("cmd.lyrics.lyrics_track", {
									trackTitle,
									trackUrl,
									lyrics: lyricsPages[currentPage],
								}),
							)
							.setThumbnail(artworkUrl)
							.setTimestamp(),
					],
					components: [row],
				})

				const filter = (interaction: ButtonInteraction<"cached">) =>
					interaction.user.id === ctx.author?.id
				const collector = (
					ctx.channel as TextChannel
				).createMessageComponentCollector({
					filter,
					componentType: ComponentType.Button,
					time: 60000,
				})

				collector.on("collect", async (interaction: ButtonInteraction) => {
					if (interaction.customId === "prev") {
						currentPage--
					} else if (interaction.customId === "next") {
						currentPage++
					} else if (interaction.customId === "stop") {
						collector.stop()
						return interaction.update({ components: [] })
					}

					await interaction.update({
						embeds: [
							embed
								.setDescription(
									ctx.locale("cmd.lyrics.lyrics_track", {
										trackTitle,
										trackUrl,
										lyrics: lyricsPages[currentPage],
									}),
								)
								.setThumbnail(artworkUrl)
								.setTimestamp(),
						],
						components: [
							new ActionRowBuilder<ButtonBuilder>().addComponents(
								new ButtonBuilder()
									.setCustomId("prev")
									.setEmoji(this.client.emoji.page.back)
									.setStyle(ButtonStyle.Secondary)
									.setDisabled(currentPage === 0),
								new ButtonBuilder()
									.setCustomId("stop")
									.setEmoji(this.client.emoji.page.cancel)
									.setStyle(ButtonStyle.Danger),
								new ButtonBuilder()
									.setCustomId("next")
									.setEmoji(this.client.emoji.page.next)
									.setStyle(ButtonStyle.Secondary)
									.setDisabled(currentPage === lyricsPages.length - 1),
							),
						],
					})
					return
				})

				collector.on("end", () => {
					ctx.editMessage({ components: [] })
				})
			} else {
				await ctx.editMessage({
					embeds: [
						embed
							.setColor(client.color.red)
							.setDescription(ctx.locale("cmd.lyrics.errors.no_results")),
					],
				})
			}
		} catch (error) {
			client.logger.error(error as string)
			await ctx.editMessage({
				embeds: [
					embed
						.setColor(client.color.red)
						.setDescription(ctx.locale("cmd.lyrics.errors.lyrics_error")),
				],
			})
		}
	}

	paginateLyrics(lyrics: string) {
		const lines = lyrics.split("\n")
		const pages: any = []
		let page = ""

		for (const line of lines) {
			if (page.length + line.length > 2048) {
				pages.push(page)
				page = ""
			}
			page += `${line}\n`
		}

		if (page) pages.push(page)
		return pages
	}
}
