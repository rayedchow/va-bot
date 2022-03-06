"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const client = new discord_js_1.Client({
    intents: [
        discord_js_1.Intents.FLAGS.GUILD_MESSAGES
    ],
    partials: [
        'MESSAGE',
    ]
});
client.on('messageCreate', msg => {
});
client.login(process.env.TOKEN);
