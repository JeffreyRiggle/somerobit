import {broadcast, broadcastTTS, broadcastToChannel, broadcastTTSToChannel} from './messagebroadcaster';
import {embedToChannel} from './embedder';
import {makeRequest} from './httpManager';
import {getAction} from './actionRepository';

let lastProcess = null;

const process = (action, requester) => {
    var retVal;

    switch (action.type) {
        case "broadcast":
            processBroadcastAction(action);
            break;
        case "broadcastrandom":
            processRandomBroadcastAction(action);
            break;
        case "embed":
            embedToChannel(action.channel, action.embed);
            break;
        case "http":
            processHttpAction(action);
            break;
        case "standard":
            retVal = action.execute(action, requester);
            break;
        case "multiaction":
            processMultiAction(action, requester);
            break;
        case "invokeaction":
            retVal = processInvokeAction(action, requester);
            break;
        default:
            break;
    }

    return retVal;
};

function processBroadcastAction(action) {
    if (action.tts) {
        broadcastTTSAction(action.channel, action.message);
    } else {
        broadcastAction(action.channel, action.message);
    }
};

function processRandomBroadcastAction(action) {
    let message = getRandomMessage(action);

    if (action.tts) {
        broadcastTTSAction(action.channel, message);
    } else {
        broadcastAction(action.channel, message);
    }
};

function broadcastAction(channel, message) {
    if (channel) {
        broadcastToChannel(message, channel);
    } else {
        broadcast(message);
    }
};

function broadcastTTSAction(channel, message) {
    if (channel) {
        broadcastTTSToChannel(message, channel);
    } else {
        broadcastTTS(message);
    }
};

function getRandomMessage(action) {
    let max = action.messages.length - 1;
    let index = Math.floor(Math.random() * max);

    return action.messages[index];
};

function processHttpAction(action) {
    makeRequest(action.method, action.url, action.body).then(data => {
        console.log(`request to ${action.url} succeeded`);
    }).catch(error => {
        console.log(`request to ${action.url} failed with ${error}`);
    });
};

function processMultiAction(action, requester) {
    action.actions.forEach((act, index, arr) => {
        act.channel = action.channel;
        act.server = action.server;
        if (action.extraData) {
            act.extraData = action.extraData;
        }
        runProcess(act, requester);
    });
};

function runProcess(action, requester) {
    if (lastProcess) {
        console.log(`queueing action ${action.id}`);
        lastProcess.then(() => {
            console.log(`running action ${action.id}`);
            let proc = process(action, requester);
            if (proc) {
                lastProcess = proc;
            }
        });
        return;
    }

    console.log(`running action ${action.id}`);
    lastProcess = process(action, requester);
}

function processInvokeAction(action, requester) {
    let act = getAction(action.id);
    let retVal;

    act.channel = action.channel;
    act.server = action.server;
    if (action.extraData) {
        act.extraData = action.extraData;
    }

    if (act) {
        retVal = process(act, requester);
    }

    return retVal;
};

export {
    process
}