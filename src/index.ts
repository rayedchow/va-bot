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

try {
	DATA.get();
} catch {
	DATA.write([]);
}

client.on('ready', () => {
	console.log('bot initialized');
	setInterval(() => {
		const currData = DATA.get();
		currData.forEach((schedule, i) => {
			if(schedule.time <= new Date().getTime()) {
				currData.splice(i, 1);
				DATA.write(currData);
				const alertChannel = client.guilds.cache.get('950093273995833405')?.channels.cache.get('950093273995833408');
				const alertUser = '419223184366239753';
				if(alertChannel && alertChannel.isText()) alertChannel.send(`<@${alertUser}> alert: ${schedule.activity} @ ${schedule.parsedTime}`);
			}
		});
	}, 15000);
});

const parseDateFormat = (date: string): string => {
	const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
	const deltaDay = ['today', 'tomorrow'];
	const currDate = new Date();

	if(/^[a-zA-Z()]+$/.test(date)) {
		if(!(days.concat(deltaDay)).includes(date)) return ''; // error handling

		// delta time formula = 86400000*((days.indexOf(date)-currDate.getDay()));
		let dateDelta = 0;
		if(days.includes(date)) {
			dateDelta = days.indexOf(date)-currDate.getDay(); // calculating dateDelta for diff string dates
			if(dateDelta === 0) dateDelta=7;
		}
		if(deltaDay.includes(date)) dateDelta = deltaDay.indexOf(date);

		return `${currDate.getFullYear()}/${currDate.getMonth()+1}/${currDate.getDate()+dateDelta}`; // returning calculated data in date format
	}

	const dateParams = date.split('/');
	return `${currDate.getFullYear()}/${dateParams[0]}/${dateParams[1]}`; // returning dateParams data in date format
};

const convertTime = (timeStr: string) => {
	const [time, modifier] = timeStr.split(' ');
	let [hours, minutes] = time.split(':');
	hours = (hours === '12') ? '00' : hours;
	if (modifier === 'pm') hours = `${parseInt(hours, 10) + 12}`;
	return `${hours}:${minutes}`;
 };

const parseTimeFormat = (format: string): string => {
	// possibilities:
	// 4pm, 4:30PM
	const [time, modifier] = [format.substring(0, format.length-2), format.substring(format.length-2, format.length)];
	if(!time.includes(':')) return convertTime(`${time}:00 ${modifier}`);
	else return convertTime(`${time} ${modifier}`);
}

const getDateString = (format: string): string => {
	if(!format.includes(' ')) return `${parseDateFormat('today')} ${parseTimeFormat(format)}`;
	const [date, time] = format.split(' ');
	return `${parseDateFormat(date)} ${parseTimeFormat(time)}`;
}

client.on('messageCreate', message => {
	if((message.channel.type === 'DM') || 
		(message.channel.name !== 'commands') || 
		(message.author.bot)) return;
	const [evDate, evName] = message.content.split('\n');
	const parsedDate = getDateString(evDate.toLowerCase());
	const date = new Date(parsedDate);
	const currData=DATA.get();
	currData.push({
		time: date.getTime(),
		parsedTime: parsedDate,
		activity: evName
	});
	DATA.write(currData);
	message.react('✅');
});

client.login(process.env.TOKEN);