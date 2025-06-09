import type { GuildMember } from "discord.js"
import Spotify from "../../classes/Spotify"
import { Command, type Context, type Reso } from "../../classes/index"

export default class LoadSpotifyPlaylist extends Command {
	constructor(client: Reso) {
		super(client, {
			name: "spotify-playlist-load",
			description: {
				content: "cmd.spotify-playlist-load.description",
				examples: ["spotify-playlist-load <playlist url>"],
				usage: "spotify-playlist-load <playlist url>",
			},
			category: "spotify",
			aliases: ["spl"],
			cooldown: 10,
			args: true,
			vote: true,
			player: {
				voice: true,
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
			options: [
				{
					name: "playlist",
					description: "cmd.spotify-playlist-load.options.playlist",
					type: 3,
					required: true,
					autocomplete: false,
				},
			],
		})
	}

	public async run(client: Reso, ctx: Context, args: string[]): Promise<any> {
		const spotify = new Spotify()
		const playlistUrl = args.join(" ").trim()
		await ctx.sendDeferMessage(ctx.locale("cmd.spotify-playlist-load.loading"))

		// biome-ignore lint/suspicious/noImplicitAnyLet: <explanation>
		let playlistDetails
		try {
			playlistDetails = await spotify.getPlaylistDetails(playlistUrl)
		} catch (error) {
			console.error("Failed to fetch playlist details:", error)
			return await ctx.editMessage({
				embeds: [
					{
						description: ctx.locale(
							"cmd.spotify-playlist-load.messages.playlist_not_exist",
						),
						color: this.client.color.red,
					},
				],
			})
		}

		if (!playlistDetails || playlistDetails.details.totalSongs === 0) {
			return await ctx.editMessage({
				embeds: [
					{
						description: ctx.locale(
							playlistDetails
								? "cmd.spotify-playlist-load.messages.playlist_empty"
								: "cmd.spotify-playlist-load.messages.playlist_not_exist",
						),
						color: client.color.red,
					},
				],
			})
		}

		let player = client.manager.getPlayer(ctx.guild!.id)
		const member = ctx.member as GuildMember

		if (!player) {
			player = client.manager.createPlayer({
				guildId: ctx.guild!.id,
				voiceChannelId: member.voice.channelId!,
				textChannelId: ctx.channel.id,
				selfMute: false,
				selfDeaf: true,
				vcRegion: member.voice.channel?.rtcRegion!,
			})
			if (!player.connected) await player.connect()
		}

		player.stopPlaying(true)
		let addedCount = 0
		const failedTracks: string[] = []

		for (const song of playlistDetails.songs) {
			if (!song.name) continue // skip songs without name

			const query = `${song.name} ${song.artist[0]}`
			try {
				const response = await player.search({ query }, ctx.author)

				if (!response || !response.tracks || response.tracks.length === 0) {
					failedTracks.push(query)
					continue
				}

				const trackToAdd =
					response.loadType === "playlist"
						? response.tracks
						: response.tracks[0]

				await player.queue.splice(0, 0, trackToAdd)
				addedCount++
			} catch (err) {
				console.error(`Search failed for "${query}":`, err)
				failedTracks.push(query)
			}
		}

		if (!player.playing && player.queue.tracks.length > 0) {
			await player.play({ paused: false })
		}

		return await ctx.editMessage({
			embeds: [
				{
					description: ctx.locale(
						"cmd.spotify-playlist-load.messages.playlist_loaded",
						{
							name: playlistDetails.details.name,
							count: addedCount,
						},
					),
					color: client.color.main,
				},
			],
		})
	}
}
