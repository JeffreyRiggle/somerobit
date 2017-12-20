import express from 'express';
import Discord from 'discord.js';
import config from './config';

const client = express();
const bot = new Discord.Client();

bot.login(config.token).then(() => {
    console.log('logged in.');
}).catch(error => {
    console.log('login failed');
});