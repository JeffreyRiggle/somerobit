import { Client, Events, GatewayIntentBits, Partials } from 'discord.js';
import {addChannel} from './channelCache';
import {broadcast} from './messagebroadcaster';
import {processActions} from './deferedActionProcessor';
import {addAction} from './actionRepository';
import {startListening} from './messageListener';
import {addAudioFiles} from './audioController';
import {addShutdownAction} from './shutdownManager';
import {setDefaultAccess, grantAccess, setInvalidAccessMessage, addPossibleAccess} from './accessControl';
import {log} from './logging';

let status;
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildModeration,
        GatewayIntentBits.GuildExpressions,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.DirectMessageTyping,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildScheduledEvents,
        GatewayIntentBits.AutoModerationConfiguration,
        GatewayIntentBits.AutoModerationExecution,
        GatewayIntentBits.GuildMessagePolls,
        GatewayIntentBits.DirectMessagePolls
    ],
    partials: [
        Partials.User,
        Partials.Channel,
        Partials.GuildMember,
        Partials.Message,
        Partials.Reaction,
        Partials.GuildScheduledEvent,
        Partials.ThreadMember,
        Partials.SoundboardSound,
        Partials.Poll,
        Partials.PollAnswer,
    ]
});
let state = 'Stopped';

const startServer = (config) => {
    return new Promise((resolve, reject) => {
        client.login(config.token).then(() => {
            log('logged in.');
        
            broadcast(config.greeting);
            processConfig(config);
            startListening(client);
            addShutdownAction(() => {
                log('exiting process');
                process.exit(0);
            });

            state = 'Running';
            resolve(state);
        }).catch(error => {
            log('login failed ' + error);
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