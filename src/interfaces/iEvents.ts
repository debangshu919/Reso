import type { ButtonInteraction, ClientEvents, Message } from "discord.js"
import type { LavalinkManagerEvents, NodeManagerEvents } from "lavalink-client"

// custom client events setupSystem and setupButtons
export interface CustomClientEvents {
	setupSystem: (message: Message) => void
	setupButtons: (interaction: ButtonInteraction) => void
}
export type AllEvents = LavalinkManagerEvents &
	NodeManagerEvents &
	ClientEvents &
	CustomClientEvents

export interface EventOptions {
	name: keyof AllEvents
	one?: boolean
}
