import {broadcast, broadcastToChannel} from './messagebroadcaster';

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
    broadcastAction(action.channel, action.message);
};

const processRandomBroadcastAction = action => {
    broadcastAction(action.channel, getRandomMessage(action));   
};

const broadcastAction = (channel, message) => {
    if (channel) {
        broadcastToChannel(message, channel);
    } else {
        broadcast(message);
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