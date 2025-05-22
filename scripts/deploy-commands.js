require("dotenv/config");
const { GatewayIntentBits } = require("discord.js");
const { env } = require("../dist/env");
const Reso = require("../dist/classes/Reso").default;
const { Logger } = require("../dist/classes/Logger");
const path = require("node:path");
const fs = require("node:fs");

/**
 * This script is used to deploy all slash commands (commands with slashCommand: true)
 * to Discord. It can be used to deploy commands globally or to a specific guild.
 *
 * Usage:
 * - To deploy globally: node scripts/deploy-commands.js
 * - To deploy to a specific guild: node scripts/deploy-commands.js <guildId>
 */

const logger = new Logger();

const client = new Reso({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildVoiceStates,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
	],
	allowedMentions: { parse: ["users", "roles"], repliedUser: false },
});

const guildId = process.argv[2];

function findSlashCommands() {
	const slashCommands = [];
	const commandsPath = path.join(process.cwd(), "dist", "commands");
	const categories = fs.readdirSync(commandsPath);

	for (const category of categories) {
		const categoryPath = path.join(commandsPath, category);
		const commandFiles = fs
			.readdirSync(categoryPath)
			.filter((file) => file.endsWith(".js"));

		for (const file of commandFiles) {
			const commandPath = path.join(categoryPath, file);
			try {
				const content = fs.readFileSync(commandPath, "utf8");
				if (content.includes("slashCommand: true")) {
					slashCommands.push({
						name: path.basename(file, ".js"),
						category: category,
					});
				}
			} catch (err) {
				logger.error(`Error reading command file ${file}: ${err}`);
			}
		}
	}

	return slashCommands;
}

async function deployCommands() {
	try {
		await client.start(env.TOKEN);

		logger.info(`Loaded ${client.commands.size} total commands`);

		const slashCommands = findSlashCommands();
		logger.info(`Found ${slashCommands.length} slash commands to deploy:`);

		slashCommands.forEach((cmd) => {
			logger.info(`- ${cmd.name} (${cmd.category})`);
		});

		if (guildId) {
			logger.info(`Deploying slash commands to guild ${guildId}...`);
			await client.deployCommands(guildId);
			logger.success(
				`Slash commands successfully deployed to guild ${guildId}!`,
			);
		} else {
			logger.info("Deploying slash commands globally...");
			await client.deployCommands();
			logger.success("Slash commands successfully deployed globally!");
		}

		logger.info("Deployment completed. Exiting...");
		setTimeout(() => process.exit(0), 1000); // Give time for logs to flush
	} catch (error) {
		logger.error(`Error deploying slash commands: ${error}`);
		process.exit(1);
	}
}

// Run the deployment function
deployCommands();
