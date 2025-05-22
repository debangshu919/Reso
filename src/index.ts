import * as fs from "node:fs"
import { Logger } from "./classes/Logger"
import { shardStart } from "./shard"
import { ThemeSelector } from "./utils/ThemeSelector"

const logger = new Logger()

const theme = new ThemeSelector()

/**
 * Sets the console window title.
 * @param title - The new title for the console window.
 */
function setConsoleTitle(title: string): void {
	// Write the escape sequence to change the console title
	process.stdout.write(`\x1b]0;${title}\x07`)
}

try {
	if (!fs.existsSync("./src/utils/ResoLogo.txt")) {
		logger.error("ResoLogo.txt file is missing")
		process.exit(1)
	}
	console.clear()
	// Set a custom title for the console window
	setConsoleTitle("Reso")
	const logFile = fs.readFileSync("./src/utils/ResoLogo.txt", "utf-8")
	console.log(theme.water(logFile))
	shardStart(logger)
} catch (err) {
	logger.error("[CLIENT] An error has occurred:", err)
}
