let channels = new Map();
let textChannels = new Map();
let stale = true;

const addChannel = (channel) => {
    channels.set(channel.id, channel);
    stale = true;
};

const removeChannel = (channel) => {
    channels.delete(channel.id);
    stale = true;
};

const clearChannels = () => {
    channels.clear();
    stale = true;
};

const textChannelMap = () => {
    if (!stale) {
        return textChannels;
    }

    textChannels.clear();

    for (let channel of channels.values()) {
        if (channel && channel.id && channel.type === 'text') {
            textChannels.set(channel.id, channel);
        }
    }

    stale = false;
    return textChannels;
}

export {
    addChannel,
    removeChannel,
    clearChannels,
    textChannelMap
}