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

const parseTimeFormat = (format: string) => {
	const dateParams = format.toUpperCase().split(' '); // date time

};

client.on('messageCreate', message => {
	if((message.channel.type === 'DM') || 
		(message.channel.name !== 'commands')) return;
	const currentUTC = new Date().getTime();

});

// setInterval(() => {

// }, 5000);

client.login(process.env.TOKEN);