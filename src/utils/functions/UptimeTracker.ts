/**
 * UptimeTracker.ts
 * Tracks and formats the bot's uptime
 */

// Store the bot start time when this module is first loaded
const botStartTime = Date.now()

/**
 * Gets the current uptime of the bot in milliseconds
 * @returns The uptime in milliseconds
 */
export function getBotUptimeMs(): number {
	return Date.now() - botStartTime
}

/**
 * Formats the bot uptime into a human-readable string
 * @returns Formatted uptime string (e.g. "2 days, 5 hours, 30 minutes, 10 seconds")
 */
export function getFormattedUptime(): string {
	const uptime = getBotUptimeMs()

	const seconds = Math.floor((uptime / 1000) % 60)
	const minutes = Math.floor((uptime / (1000 * 60)) % 60)
	const hours = Math.floor((uptime / (1000 * 60 * 60)) % 24)
	const days = Math.floor(uptime / (1000 * 60 * 60 * 24))

	const parts = []

	if (days > 0) parts.push(`${days} day${days === 1 ? "" : "s"}`)
	if (hours > 0) parts.push(`${hours} hour${hours === 1 ? "" : "s"}`)
	if (minutes > 0) parts.push(`${minutes} minute${minutes === 1 ? "" : "s"}`)
	if (seconds > 0) parts.push(`${seconds} second${seconds === 1 ? "" : "s"}`)

	return parts.join(", ")
}
