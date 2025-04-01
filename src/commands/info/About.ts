import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { Command, type Context, type Lavamusic } from '../../structures/index';

export default class About extends Command {
	constructor(client: Lavamusic) {
		super(client, {
			name: 'about',
			description: {
				content: 'cmd.about.description',
				examples: ['about'],
				usage: 'about',
			},
			category: 'info',
			aliases: ['ab'],
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
				client: ['SendMessages', 'ReadMessageHistory', 'ViewChannel', 'EmbedLinks'],
				user: [],
			},
			slashCommand: true,
			options: [],
		});
	}

	public async run(client: Lavamusic, ctx: Context): Promise<any> {
		const inviteButton = new ButtonBuilder()
			.setLabel(ctx.locale('buttons.invite'))
			.setStyle(ButtonStyle.Link)
			.setURL(
				`https://discord.com/api/oauth2/authorize?client_id=${client.env.CLIENT_ID}&permissions=8&scope=bot%20applications.commands`,
			);
		const supportButton = new ButtonBuilder()
			.setLabel(ctx.locale('buttons.support'))
			.setStyle(ButtonStyle.Link)
			.setURL('https://discord.com');
		const row = new ActionRowBuilder<ButtonBuilder>().addComponents(inviteButton, supportButton);
		const embed = this.client
			.embed()
			.setAuthor({
				name: 'Reso',
				iconURL: 'https://media.discordapp.net/attachments/1356507997597208636/1356508050693029968/Untitled_logo_1_free-file_2.jpg?ex=67ecd211&is=67eb8091&hm=6ba3dd773cb76b3c91d635f56cccd3affce5521e45b84cabf86eec21011b35f6&=&format=webp',
			})
			.setThumbnail(
				'https://media.discordapp.net/attachments/1356507997597208636/1356508050693029968/Untitled_logo_1_free-file_2.jpg?ex=67ecd211&is=67eb8091&hm=6ba3dd773cb76b3c91d635f56cccd3affce5521e45b84cabf86eec21011b35f6&=&format=webp',
			)
			.setColor(this.client.color.main)
			.addFields(
				{
					name: ctx.locale('cmd.about.fields.creator'),
					value: '[debangshu919](https://github.com/debangshu919)',
					inline: true,
				},
				{
					name: ctx.locale('cmd.about.fields.repository'),
					value: '[Here](https://github.com/debangshu919/Reso)',
					inline: true,
				},
				// {
				// 	name: ctx.locale('cmd.about.fields.support'),
				// 	value: '[Here](https://discord.gg/YQsGbTwPBx)',
				// 	inline: true,
				// },
				{
					name: '\u200b',
					value: ctx.locale('cmd.about.fields.description'),
					inline: false,
				},
			);
		await ctx.sendMessage({
			content: '',
			embeds: [embed],
			components: [row],
		});
	}
}

/**
 * Project: lavamusic
 * Author: Appu
 * Main Contributor: LucasB25
 * Company: Coders
 * Copyright (c) 2024. All rights reserved.
 * This code is the property of Coder and may not be reproduced or
 * modified without permission. For more information, contact us at
 * https://discord.gg/YQsGbTwPBx
 */
