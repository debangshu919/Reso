require('dotenv/config');
const { GatewayIntentBits } = require('discord.js');
const { env } = require('../dist/env');
const Reso = require('../dist/structures/Reso').default;
const Logger = require('../dist/structures/Logger').default;
const path = require('path');
const fs = require('fs');

/**
 * This script is used to deploy all slash commands (commands with slashCommand: true)
 * to Discord. It can be used to deploy commands globally or to a specific guild.
 *
 * Usage:
 * - To deploy globally: node scripts/deploy-commands.js
 * - To deploy to a specific guild: node scripts/deploy-commands.js <guildId>
 */

const logger = new Logger();

// Create a client instance with necessary intents
const client = new Reso({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
  allowedMentions: { parse: ['users', 'roles'], repliedUser: false },
});

// Handle command line arguments
const guildId = process.argv[2];

// Function to manually find and log all commands
function findSlashCommands() {
  const slashCommands = [];
  const commandsPath = path.join(process.cwd(), "dist", "commands");
  const categories = fs.readdirSync(commandsPath);
  
  for (const category of categories) {
    const categoryPath = path.join(commandsPath, category);
    const commandFiles = fs.readdirSync(categoryPath).filter(file => file.endsWith('.js'));
    
    for (const file of commandFiles) {
      const commandPath = path.join(categoryPath, file);
      try {
        // We don't need to require every command, just check its content for slashCommand: true
        const content = fs.readFileSync(commandPath, 'utf8');
        if (content.includes('slashCommand: true')) {
          slashCommands.push({
            name: path.basename(file, '.js'),
            category: category
          });
        }
      } catch (err) {
        logger.error(`Error reading command file ${file}: ${err}`);
      }
    }
  }
  
  return slashCommands;
}

// Function to deploy commands
async function deployCommands() {
  try {
    // First, load all commands by initializing client's internal methods
    // Important: We need to call start() to properly load all commands
    await client.start(env.TOKEN);
    
    logger.info(`Loaded ${client.commands.size} total commands`);
    
    // Count slash commands
    const slashCommands = findSlashCommands();
    logger.info(`Found ${slashCommands.length} slash commands to deploy:`);
    
    slashCommands.forEach(cmd => {
      logger.info(`- ${cmd.name} (${cmd.category})`);
    });
    
    // Deploy commands (this uses client.body which is populated by client.start())
    if (guildId) {
      logger.info(`Deploying slash commands to guild ${guildId}...`);
      await client.deployCommands(guildId);
      logger.success(`Slash commands successfully deployed to guild ${guildId}!`);
    } else {
      logger.info('Deploying slash commands globally...');
      await client.deployCommands();
      logger.success(`Slash commands successfully deployed globally!`);
    }

    // Exit process
    logger.info('Deployment completed. Exiting...');
    setTimeout(() => process.exit(0), 1000); // Give time for logs to flush
  } catch (error) {
    logger.error(`Error deploying slash commands: ${error}`);
    process.exit(1);
  }
}

// Run the deployment function
deployCommands();

/**
 * Project: Reso
 * Author: Appu
 * Main Contributor: LucasB25
 * Company: Coders
 * Copyright (c) 2024. All rights reserved.
 * This code is the property of Coder and may not be reproduced or
 * modified without permission. For more information, contact us at
 * https://discord.gg/YQsGbTwPBx
 */ 