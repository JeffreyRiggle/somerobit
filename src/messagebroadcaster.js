let channels = new Map();

const addTextChannel = (channel) => {
    channels.set(channel.id, channel);
};

const removeTextChannel = (channel) => {
    channels.delete(channel.id);
};

const clearTextChannels = () => {
    channels.clear();
};

const broadcast = (message, channelIds) => {
    if (!channelIds) {
        for (let channel of channels.values()) {
            sendMessage(channel, message);
        };

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
    let channel = channels.get(id);

    if (!channel) {
        return;
    }

    sendMessage(channel, message);
};

const broadcastTTSToChannel = (message, id) => {
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
    addTextChannel,
    removeTextChannel,
    clearTextChannels,
    broadcast,
    broadcastTTS,
    broadcastToChannel,
    broadcastTTSToChannel
};