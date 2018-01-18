import Discord from 'discord.js';
import fs from 'fs';
import {addChannel} from './channelCache';
import {broadcast} from './messagebroadcaster';
import {processActions} from './deferedActionProcessor';
import {addAction} from './actionRepository';
import {startListening} from './messageListener';
import {addAudioFiles} from './audioController';
import {addShutdownAction} from './shutdownManager';
import {setDefaultAccess, grantAccess, setInvalidAccessMessage, addPossibleAccess} from './accessControl';
import './standardActions/standardActions';
import 'opusscript';

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
            console.log(`Found channel ${channel.id} with type ${channel.type} and name ${channel.name} on server ${channel.server}`);
    
            addChannel(channel);
        });
    
        broadcast(config.greeting);
        processConfig();
        startListening(client);
        addShutdownAction(() => {
            console.log('exiting process');
            process.exit(0);
        });
    }).catch(error => {
        console.log('login failed ' + error);
        process.exit(1);
    });
};

const processConfig = () => {
    processActions(config.deferredactions);

    let actionIds = [];
    config.actions.forEach((val, i, arr) => {
        actionIds.push(val.id);
        addAction(val.id, val.action);
    });
    addPossibleAccess(actionIds);

    if (!config.audioSources) {
        return;
    }

    config.audioSources.forEach((source, index, arr) => {
        addAudioFiles(source);
    });

    if (config.access) {
        processAccess(config.access);
    }
};

function processAccess(access) {
    if (access.default) {
        setDefaultAccess(access.default);
    }

    if (access.deniedMessage) {
        setInvalidAccessMessage(access.deniedMessage);
    }

    if (!access.users) {
        return;
    }

    access.users.forEach((val, index, arr) => {
        grantAccess(val.name, val.rights);
    });
}