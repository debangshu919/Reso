import type { APIApplicationCommandOption } from "discord.js"
import type {
	CommandDescription,
	CommandOptions,
	CommandPermissions,
	CommandPlayer,
} from "../interfaces/iCommands"
import type Reso from "./Reso"

export default class Command {
	public client: Reso
	public name: string
	public name_localizations?: Record<string, string>
	public description: CommandDescription
	public description_localizations?: Record<string, string>
	public aliases: string[]
	public cooldown: number
	public args: boolean
	public vote: boolean
	public player: CommandPlayer
	public permissions: CommandPermissions
	public slashCommand: boolean
	public options: APIApplicationCommandOption[]
	public category: string

	constructor(client: Reso, options: CommandOptions) {
		this.client = client
		this.name = options.name
		this.name_localizations = options.name_localizations ?? {}
		this.description = {
			content: options.description?.content ?? "No description provided",
			usage: options.description?.usage ?? "No usage provided",
			examples: options.description?.examples ?? ["No examples provided"],
		}
		this.description_localizations = options.description_localizations ?? {}
		this.aliases = options.aliases ?? []
		this.cooldown = options.cooldown ?? 3
		this.args = options.args ?? false
		this.vote = options.vote ?? false
		this.player = {
			voice: options.player?.voice ?? false,
			dj: options.player?.dj ?? false,
			active: options.player?.active ?? false,
			djPerm: options.player?.djPerm ?? null,
		}
		this.permissions = {
			dev: options.permissions?.dev ?? false,
			client: options.permissions?.client ?? [
				"SendMessages",
				"ViewChannel",
				"EmbedLinks",
			],
			user: options.permissions?.user ?? [],
		}
		this.slashCommand = options.slashCommand ?? false
		this.options = options.options ?? []
		this.category = options.category ?? "general"
	}

	public async run(
		_client: Reso,
		_message: any,
		_args: string[],
	): Promise<any> {
		return await Promise.resolve()
	}
}
