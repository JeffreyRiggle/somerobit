import {broadcast, broadcastTTS, broadcastToChannel, broadcastTTSToChannel} from './messagebroadcaster';

const process = action => {
    switch (action.type) {
        case "broadcast":
            processBroadcastAction(action);
            break;
        case "broadcastrandom":
            processRandomBroadcastAction(action);
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
}

export {
    process
}