import pkg, { type SignaleOptions } from 'signale';
const { Signale } = pkg;

const options: SignaleOptions = {
	disabled: false,
	interactive: false,
	logLevel: 'info',
	scope: 'Reso',
	types: {
		info: {
			badge: 'ℹ',
			color: 'blue',
			label: 'info',
		},
		warn: {
			badge: '⚠',
			color: 'yellow',
			label: 'warn',
		},
		error: {
			badge: '✖',
			color: 'red',
			label: 'error',
		},
		debug: {
			badge: '🐛',
			color: 'magenta',
			label: 'debug',
		},
		success: {
			badge: '✔',
			color: 'green',
			label: 'success',
		},
		log: {
			badge: '📝',
			color: 'white',
			label: 'log',
		},
		pause: {
			badge: '⏸',
			color: 'yellow',
			label: 'pause',
		},
		start: {
			badge: '▶',
			color: 'green',
			label: 'start',
		},
	},
};

export default class Logger extends Signale {
	constructor() {
		super(options);
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
