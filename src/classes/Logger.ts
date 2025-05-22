import { Signale } from "signale"
import fileLogger from "../utils/winston"

export class Logger {
	private signale: Signale

	constructor(scope = "Reso") {
		this.signale = new Signale({ scope })
	}

	info(message: string, ...args: unknown[]): void {
		this.signale.info(message, ...args)
		fileLogger.info(message, ...args)
	}

	warn(message: string, ...args: unknown[]): void {
		this.signale.warn(message, ...args)
		fileLogger.warn(message, ...args)
	}

	error(message: string, ...args: unknown[]): void {
		this.signale.error(message, ...args)
		fileLogger.error(message, ...args)
	}

	success(message: string, ...args: unknown[]): void {
		this.signale.success(message, ...args)
		fileLogger.info(`[SUCCESS] ${message}`, ...args)
	}

	start(message: string, ...args: unknown[]): void {
		this.signale.start(message, ...args)
		fileLogger.info(`[START] ${message}`, ...args)
	}
}
