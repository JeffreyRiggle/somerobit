import {textChannelMap} from './channelCache';

const broadcast = (message, channelIds) => {
    let channels = textChannelMap();

    if (!channelIds) {
        for (let channel of channels.values()) {
            sendMessage(channel, message);
        }

        return;
    }

    channelIds.forEach(id => {
        let channel = channels.get(id);

        if (!channel) {
            return;
        }

        sendMessage(channel, message);
    });
};

const broadcastTTS = (message, channelIds) => {
    let channels = textChannelMap();

    if (!channelIds) {
        for (let channel of channels.values()) {
            sendTTSMessage(channel, message);
        };

        return;
    }

    channelIds.forEach(id => {
        let channel = channels.get(id);

        if (!channel) {
            return;
        }

        sendTTSMessage(channel, message);
    });
};

const broadcastToChannel = (message, id) => {
    let channels = textChannelMap();

    let channel = channels.get(id);

    if (!channel) {
        return;
    }

    sendMessage(channel, message);
};

const broadcastTTSToChannel = (message, id) => {
    let channels = textChannelMap();

    let channel = channels.get(id);

    if (!channel) {
        return;
    }

    sendTTSMessage(channel, message);
};

const sendMessage = (channel, message) => {
    channel.send(message).then(message => {
        console.log('Sent message ' + message.content);
    }).catch(error => {
        console.log('Got error ' + error);
    });
};

const sendTTSMessage = (channel, message) => {
    channel.send(message, {
        tts: true
    }).then(message => {
        console.log('Sent message ' + message.content);
    }).catch(error => {
        console.log('Got error ' + error);
    });
};

export {
    broadcast,
    broadcastTTS,
    broadcastToChannel,
    broadcastTTSToChannel
};