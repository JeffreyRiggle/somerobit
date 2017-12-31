import {broadcast, broadcastTTS, broadcastToChannel, broadcastTTSToChannel} from './messagebroadcaster';
import {embedToChannel} from './embedder';
import {makeRequest} from './httpManager';
import {getAction} from './actionRepository';

const process = (action, channel) => {
    switch (action.type) {
        case "broadcast":
            processBroadcastAction(action);
            break;
        case "broadcastrandom":
            processRandomBroadcastAction(action);
            break;
        case "embed":
            processEmbedAction(action);
            break;
        case "http":
            processHttpAction(action);
            break;
        case "standard":
            action.execute(action, channel);
            break;
        default:
            break;
    }
};

const processBroadcastAction = action => {
    if (action.tts) {
        broadcastTTSAction(action.channel, action.message);
    } else {
        broadcastAction(action.channel, action.message);
    }
};

const processRandomBroadcastAction = action => {
    let message = getRandomMessage(action);

    if (action.tts) {
        broadcastTTSAction(action.channel, message);
    } else {
        broadcastAction(action.channel, message);
    }
};

const broadcastAction = (channel, message) => {
    if (channel) {
        broadcastToChannel(message, channel);
    } else {
        broadcast(message);
    }
};

const broadcastTTSAction = (channel, message) => {
    if (channel) {
        broadcastTTSToChannel(message, channel);
    } else {
        broadcastTTS(message);
    }
};

const getRandomMessage = action => {
    let max = action.messages.length - 1;
    let index = Math.floor(Math.random() * max);

    return action.messages[index];
};

const processEmbedAction = action => {
    embedToChannel(action.channel, action.embed);
};

const processHttpAction = action => {
    makeRequest(action.method, action.url, action.body).then(data => {
        console.log(`request to ${action.url} succeeded`);
    }).catch(error => {
        console.log(`request to ${action.url} failed with ${error}`);
    });
};

export {
    process
}