import { SpotifyApi } from "@spotify/web-api-ts-sdk"
import { env } from "../env"

export default class Spotify {
	private spotifySdk: SpotifyApi

	constructor() {
		this.spotifySdk = SpotifyApi.withClientCredentials(
			env.SPOTIFY_CLIENT_ID,
			env.SPOTIFY_CLIENT_SECRET,
		)
	}

	private extractPlaylistId(url: string): string | null {
		const match = url.match(/playlist\/([a-zA-Z0-9]+)(\?|$)/)
		return match ? match[1] : null
	}

	public async getPlaylistDetails(playlistUrl: string) {
		const playlistId = this.extractPlaylistId(playlistUrl)

		if (!playlistId) {
			throw new Error("Invalid playlist URL")
		}

		const playlist = await this.spotifySdk.playlists.getPlaylist(playlistId)
		const playlistItems =
			await this.spotifySdk.playlists.getPlaylistItems(playlistId)

		return {
			details: {
				name: playlist.name,
				author: playlist.owner.display_name,
				totalSongs: playlist.tracks.total,
			},
			songs: playlistItems.items
				.filter((item) => item.track !== null)
				.map((item) => ({
					name: item.track.name,
					artist: item.track.artists.map((artist) => artist.name),
					duration: item.track.duration_ms / 1000,
				})),
		}
	}
}
