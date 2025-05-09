import { Event, type Reso } from '../../structures/index';

export default class Raw extends Event {
	client: Reso;

	constructor(client: Reso, file: string) {
		super(client, file, {
			name: 'raw',
		});
		this.client = client;
	}

	public async run(d: any): Promise<void> {
		this.client.manager.sendRawData(d);
	}
}

/**
 */
