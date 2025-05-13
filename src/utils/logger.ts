import path from "node:path"
import util from "node:util"
import {
	bgGreen,
	bgRed,
	bgYellow,
	blue,
	bold,
	green,
	magenta,
	red,
	underline,
	yellow,
} from "colorette"
import * as SourceMapSupport from "source-map-support"
import { createLogger, format, transports } from "winston"
import type {
	ConsoleTransportInstance,
	FileTransportInstance,
} from "winston/lib/winston/transports"

// Enable source map support for better stack traces
SourceMapSupport.install()

const colorizeLevel = (level: string): string => {
	switch (level) {
		case "ERROR":
			return red(bold(level))
		case "WARN":
			return yellow(underline(level))
		case "INFO":
			return green(level)
		default:
			return level
	}
}

const colorizeTimestamp = (timestamp: string, level: string): string => {
	switch (level) {
		case "ERROR":
			return bgRed(timestamp)
		case "WARN":
			return bgYellow(timestamp)
		case "INFO":
			return bgGreen(timestamp)
		default:
			return timestamp
	}
}

const consoleLogFormat = format.printf((info) => {
	const { level, message, timestamp, meta = {} } = info

	const customLevel = colorizeLevel(level.toUpperCase())
	const customTimestamp = colorizeTimestamp(
		timestamp as string,
		info.level.toUpperCase(),
	)
	const customMessage = blue(message as string)
	const customMeta = util.inspect(meta, {
		showHidden: false,
		depth: null,
		colors: true,
	})

	if (!info.meta) {
		return `${customTimestamp} [${customLevel}] ${customMessage}\n`
	}

	const customLog = `${customTimestamp} [${customLevel}] ${customMessage}\n${magenta(
		"META",
	)}:\t${customMeta}\n`

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
