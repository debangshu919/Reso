import signale from "signale"
// import pkg, { type SignaleOptions } from "signale";
import fileLogger from "../utils/winston"

// const options: SignaleOptions = {
//   disabled: false,
//   interactive: false,
//   logLevel: "info",
//   scope: "Reso",
//   types: {
//     info: {
//       badge: "ℹ",
//       color: "blue",
//       label: "info",
//     },
//     warn: {
//       badge: "⚠",
//       color: "yellow",
//       label: "warn",
//     },
//     error: {
//       badge: "✖",
//       color: "red",
//       label: "error",
//     },
//     debug: {
//       badge: "🐛",
//       color: "magenta",
//       label: "debug",
//     },
//     success: {
//       badge: "✔",
//       color: "green",
//       label: "success",
//     },
//     log: {
//       badge: "📝",
//       color: "white",
//       label: "log",
//     },
//     pause: {
//       badge: "⏸",
//       color: "yellow",
//       label: "pause",
//     },
//     start: {
//       badge: "▶",
//       color: "green",
//       label: "start",
//     },
//   },
// };

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

	// add more wrappers as needed
}

export default new Logger()
