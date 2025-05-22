import type { AllEvents, EventOptions } from "../interfaces/iEvents"
import type Reso from "./Reso"

export default class Event {
	public client: Reso
	public one: boolean
	public file: string
	public name: keyof AllEvents
	public fileName: string

	constructor(client: Reso, file: string, options: EventOptions) {
		this.client = client
		this.file = file
		this.name = options.name
		this.one = options.one ?? false
		this.fileName = file.split(".")[0]
	}

	public async run(..._args: any): Promise<void> {
		return await Promise.resolve()
	}
}
