"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const dotenv_1 = require("dotenv");
const fs_1 = require("fs");
(0, dotenv_1.config)();
const client = new discord_js_1.Client({
    intents: [
        discord_js_1.Intents.FLAGS.GUILD_MESSAGES
    ],
    partials: [
        'MESSAGE',
    ]
});
const DATA = {
    get: () => JSON.parse((0, fs_1.readFileSync)('./data.json').toString()),
    write: (data) => (0, fs_1.writeFileSync)('./data.json', JSON.stringify(data))
};
client.on('messageCreate', message => {
    console.log(message);
    // console.log(message.content, message.channel);
});
client.login(process.env.TOKEN);
