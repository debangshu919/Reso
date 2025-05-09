import { type ClientOptions, GatewayIntentBits } from 'discord.js';
import { env } from './env';
import Reso from './structures/Reso';

const { GuildMembers, MessageContent, GuildVoiceStates, GuildMessages, Guilds, GuildMessageTyping } = GatewayIntentBits;

const clientOptions: ClientOptions = {
	intents: [Guilds, GuildMessages, MessageContent, GuildVoiceStates, GuildMembers, GuildMessageTyping],
	allowedMentions: { parse: ['users', 'roles'], repliedUser: false },
};

const client = new Reso(clientOptions);
client.start(env.TOKEN);

/**
 */
