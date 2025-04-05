import type { ButtonInteraction, ClientEvents, Message } from 'discord.js';
import type { LavalinkManagerEvents, NodeManagerEvents } from 'lavalink-client';
import type Reso from './Reso';

// custom client events setupSystem and setupButtons
interface CustomClientEvents {
	setupSystem: (message: Message) => void;
	setupButtons: (interaction: ButtonInteraction) => void;
}
export type AllEvents = LavalinkManagerEvents & NodeManagerEvents & ClientEvents & CustomClientEvents;

interface EventOptions {
	name: keyof AllEvents;
	one?: boolean;
}

export default class Event {
	public client: Reso;
	public one: boolean;
	public file: string;
	public name: keyof AllEvents;
	public fileName: string;

	constructor(client: Reso, file: string, options: EventOptions) {
		this.client = client;
		this.file = file;
		this.name = options.name;
		this.one = options.one ?? false;
		this.fileName = file.split('.')[0];
	}

	public async run(..._args: any): Promise<void> {
		return await Promise.resolve();
	}
}

/**
 * Project: Reso
 * Author: Appu
 * Main Contributor: LucasB25
 * Company: Coders
 * Copyright (c) 2024. All rights reserved.
 * This code is the property of Coder and may not be reproduced or
 * modified without permission. For more information, contact us at
 * https://discord.gg/YQsGbTwPBx
 */
