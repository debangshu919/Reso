import type {
	APIApplicationCommandOption,
	PermissionResolvable,
} from "discord.js"

export interface CommandDescription {
	content: string
	usage: string
	examples: string[]
}

export interface CommandPlayer {
	voice: boolean
	dj: boolean
	active: boolean
	djPerm: string | null
}

export interface CommandPermissions {
	dev: boolean
	client: string[] | PermissionResolvable
	user: string[] | PermissionResolvable
}

export interface CommandOptions {
	name: string
	name_localizations?: Record<string, string>
	description?: Partial<CommandDescription>
	description_localizations?: Record<string, string>
	aliases?: string[]
	cooldown?: number
	args?: boolean
	vote?: boolean
	player?: Partial<CommandPlayer>
	permissions?: Partial<CommandPermissions>
	slashCommand?: boolean
	options?: APIApplicationCommandOption[]
	category?: string
}
