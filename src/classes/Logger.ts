import signale from "signale"
import fileLogger from "../utils/winston"

class Logger {
	info(message: string, ...args: unknown[]) {
		signale.info(message, ...args)
		fileLogger.info(message, ...args)
	}

	warn(message: string, ...args: unknown[]) {
		signale.warn(message, ...args)
		fileLogger.warn(message, ...args)
	}

	error(message: string, ...args: unknown[]) {
		signale.error(message, ...args)
		fileLogger.error(message, ...args)
	}

	success(message: string, ...args: unknown[]) {
		signale.success(message, ...args)
		fileLogger.info(`[SUCCESS] ${message}`, ...args) // mapped to info level in file
	}

	start(message: string, ...args: unknown[]) {
		signale.start(message, ...args)
		fileLogger.info(`[START] ${message}`, ...args)
	}
}

export default new Logger()
