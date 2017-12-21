import express from 'express';
import Discord from 'discord.js';
import config from './config';
import {addChannel, broadcast} from './messagebroadcaster';

const server = express();
const client = new Discord.Client();

client.login(config.token).then(() => {
    console.log('logged in.');
    client.channels.forEach(channel => {
        if (channel && channel.id) {
            addChannel(channel);
        }
    });
    broadcast('Hello World');
}).catch(error => {
    console.log('login failed ' + error);
});