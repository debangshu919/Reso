import path from "node:path"
import util from "node:util"
import * as SourceMapSupport from "source-map-support"
import { createLogger, format, transports } from "winston"
import type {
	ConsoleTransportInstance,
	FileTransportInstance,
} from "winston/lib/winston/transports"

// Enable source map support for better stack traces
SourceMapSupport.install()

const consoleLogFormat = format.printf((info) => {
	const { level, message, timestamp, meta = {} } = info

	const customLevel = level.toUpperCase()
	const customTimestamp = timestamp
	const customMessage = message
	const customMeta = util.inspect(meta, {
		showHidden: false,
		depth: null,
		colors: true,
	})

	const customLog = `${customTimestamp} [${customLevel}] ${customMessage}\nMETA: ${customMeta}\n`

	return customLog
})

const fileLogFormat = format.printf((info) => {
	const { level, message, timestamp, meta = {} } = info

	const logMeta: Record<string, unknown> = {}
	for (const [key, value] of Object.entries(meta as object)) {
		if (value instanceof Error) {
			logMeta[key] = {
				name: value.name,
				message: value.message,
				trace: value.stack || "",
			}
		} else {
			logMeta[key] = value
		}
	}

	const logData = {
		level: level.toUpperCase(),
		message,
		timestamp,
		meta: logMeta,
	}

	return JSON.stringify(logData, null, 4)
})

const consoleTransport = (): Array<ConsoleTransportInstance> => {
	return [
		new transports.Console({
			level: "info",
			format: format.combine(format.timestamp(), consoleLogFormat),
		}),
	]
}

const fileTransport = (): Array<FileTransportInstance> => {
	return [
		new transports.File({
			filename: path.join(__dirname, "../", "../", "logs", "app.log"),
			level: "info",
			format: format.combine(format.timestamp(), fileLogFormat),
		}),
	]
}

export default createLogger({
	defaultMeta: {},
	transports: [...fileTransport(), ...consoleTransport()],
})
