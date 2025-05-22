import { type ClientOptions, GatewayIntentBits } from "discord.js"
import Reso from "./classes/Reso"
import { env } from "./env"

const {
	GuildMembers,
	MessageContent,
	GuildVoiceStates,
	GuildMessages,
	Guilds,
	GuildMessageTyping,
	DirectMessages,
} = GatewayIntentBits

const clientOptions: ClientOptions = {
	intents: [
		Guilds,
		GuildMessages,
		MessageContent,
		GuildVoiceStates,
		GuildMembers,
		GuildMessageTyping,
		DirectMessages,
	],
	allowedMentions: { parse: ["users", "roles"], repliedUser: false },
}

const client = new Reso(clientOptions)
client.start(env.TOKEN)
