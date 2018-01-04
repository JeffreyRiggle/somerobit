import {addChannel, removeChannel} from './channelCache';

const createTextChannel = (server, name) => {
    return server.createChannel(name, 'text');
};

const createVoiceChannel = (server, name) => {
    return server.createChannel(name, 'voice');
};

export {
    createTextChannel,
    createVoiceChannel
};