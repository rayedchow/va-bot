import { Client, Intents } from 'discord.js';
import { config } from 'dotenv';
import { readFileSync, writeFileSync } from 'fs';
import { Schedule } from './@types/Database';
config();

const client = new Client({
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MESSAGES
	]
});

const DATA = {
	get: (): Schedule[] => JSON.parse(readFileSync('./data.json').toString()),
	write: (data: Schedule[]) => writeFileSync('./data.json', JSON.stringify(data))
};

client.on('ready', () => console.log('bot initialized'));

client.on('messageCreate', message => {
	// console.log(message);
	console.log(message.content, message.channel);
});

client.login(process.env.TOKEN);