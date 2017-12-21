let channels = new Map();

const addChannel = (channel) => {
    channels.set(channel.id, channel);
};

const removeChannel = (channel) => {
    channels.delete(channel.id);
};

const clearChannels = () => {
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

const sendMessage = (channel, message) => {
    channel.send(message).then(message => {
        console.log('Sent message ' + message.content);
    }).catch(error => {
        console.log('Got error ' + error);
    });
};

export {
    addChannel,
    removeChannel,
    clearChannels,
    broadcast
};