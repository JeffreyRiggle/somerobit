import {addChannel, removeChannel} from './channelCache';

const createTextChannel = (server, name) => {
    return server.createChannel(name, 'text');
};

const createVoiceChannel = (server, name) => {
    return server.createChannel(name, 'voice');
};

const deleteChannel = channel => {
    return server.deleteChannel(channel);
};

export {
    createTextChannel,
    createVoiceChannel,
    deleteChannel
};