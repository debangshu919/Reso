import path from "node:path"
import * as SourceMapSupport from "source-map-support"
// biome-ignore lint/style/useImportType: <explanation>
import {
	Logger as WinstonLogger,
	createLogger,
	format,
	transports,
} from "winston"
import type { FileTransportInstance } from "winston/lib/winston/transports"

// Enable source map support for better stack traces
SourceMapSupport.install()

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

const fileTransport = (): Array<FileTransportInstance> => {
	return [
		new transports.File({
			filename: path.join(__dirname, "../", "../", "logs", "app.log"),
			level: "info",
			format: format.combine(format.timestamp(), fileLogFormat),
		}),
	]
}

const fileLogger: WinstonLogger = createLogger({
	defaultMeta: {},
	transports: [...fileTransport()],
})

export default fileLogger
