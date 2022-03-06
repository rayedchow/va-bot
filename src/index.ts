import { Client, Intents } from 'discord.js';
import { config } from 'dotenv';
import { readFileSync, writeFileSync } from 'fs';
config();

const client = new Client({
	intents: [
		Intents.FLAGS.GUILD_MESSAGES
	],
	partials: [
		'MESSAGE',
	]
});

client.on('messageCreate', msg => {
	
});

client.login(process.env.TOKEN);