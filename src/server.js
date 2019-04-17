import Discord from 'discord.js';
import {addChannel} from './channelCache';
import {broadcast} from './messagebroadcaster';
import {processActions} from './deferedActionProcessor';
import {addAction} from './actionRepository';
import {startListening} from './messageListener';
import {addAudioFiles} from './audioController';
import {addShutdownAction} from './shutdownManager';
import {setDefaultAccess, grantAccess, setInvalidAccessMessage, addPossibleAccess} from './accessControl';

const client = new Discord.Client();
let state = 'Stopped';

const startServer = (config) => {
    return new Promise((resolve, reject) => {
        client.login(config.token).then(() => {
            console.log('logged in.');
        
            client.channels.forEach(channel => {
                console.log(`Found channel ${channel.id} with type ${channel.type} and name ${channel.name} on server ${channel.server}`);
        
                addChannel(channel);
            });
        
            broadcast(config.greeting);
            processConfig(config);
            startListening(client);
            addShutdownAction(() => {
                console.log('exiting process');
                process.exit(0);
            });

            state = 'Running';
            resolve(state);
        }).catch(error => {
            console.log('login failed ' + error);
            status = 'Failed';
            reject('Login failed');
        });
    });
};

const processConfig = (config) => {
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

const getState = () => {
    return state;
}

export {
    startServer,
    getState
}