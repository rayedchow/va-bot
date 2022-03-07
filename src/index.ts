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

const parseDateFormat = (format: string): string => {
	const date = format.toLowerCase();
	const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
	const deltaDay = ['today', 'tomorrow'];

	if(/^[a-zA-Z()]+$/.test(date)) {
		if(!(days.concat(deltaDay)).includes(date)) return ''; // error handling
		const currDate = new Date();

		// delta time formula = 86400000*((days.indexOf(date)-currDate.getDay()));
		let dateDelta = 0;
		if(days.includes(date)) {
			dateDelta = days.indexOf(date)-currDate.getDay(); // calculating dateDelta for diff string dates
			if(dateDelta === 0) dateDelta=7;
		}
		if(deltaDay.includes(date)) dateDelta = deltaDay.indexOf(date);

		return `2022/${currDate.getMonth()+1}/${currDate.getDate()+dateDelta}`; // returning calculated data in date format
	}

	const dateParams = date.split('/');
	return `2022/${dateParams[0]}/${dateParams[1]}`; // returning dateParams data in date format
};

const convertTime = (timeStr: string) => {
	const [time, modifier] = timeStr.split(' ');
	let [hours, minutes] = time.split(':');
	hours = (hours === '12') ? '00' : hours;
	if (modifier === 'PM') hours = `${parseInt(hours, 10) + 12}`;
	return `${hours}:${minutes}`;
 };

const parseTimeFormat = (format: string): string => {
	// possibilities:
	// 4pm, 4:30PM
	format = format.toUpperCase();
	const [time, modifier] = [format.substring(0, format.length-2), format.substring(format.length-2, format.length)];
	if(!time.includes(':')) return convertTime(`${time}:00 ${modifier}`);
	else return convertTime(`${time} ${modifier}`);
}

client.on('messageCreate', message => {
	if((message.channel.type === 'DM') || 
		(message.channel.name !== 'commands') || 
		(message.author.bot)) return;
	const currentUTC = new Date().getTime();
	message.channel.send(`date: ${parseTimeFormat(message.content)}`);
});

// setInterval(() => {

// }, 5000);

client.login(process.env.TOKEN);