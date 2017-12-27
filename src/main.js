import express from 'express';
import Discord from 'discord.js';
import fs from 'fs';
import {addChannel} from './channelCache';
import {broadcast} from './messagebroadcaster';
import {processActions} from './deferedActionProcessor';

const server = express();
const client = new Discord.Client();
let configFile = '';
let config = {};

process.argv.forEach((val, i, arr) => {
    if (val.endsWith('json')) {
        configFile = val;
    }
});

if (!configFile) {
    throw 'No Config provided'; 
}

fs.readFile(configFile, 'utf8', (err, data) => {
    if (err) {
        console.log('Got error ' + err);
        return;
    }

    config = JSON.parse(data);
    startServer();
});

const startServer = () => {
    client.login(config.token).then(() => {
        console.log('logged in.');
    
        client.channels.forEach(channel => {
            console.log('Found channel ' + channel.id + ' with type ' + channel.type);
    
            addChannel(channel);
        });
    
        broadcast(config.greeting);
        processActions(config.actions);
    }).catch(error => {
        console.log('login failed ' + error);
    });
}
