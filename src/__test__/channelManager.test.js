import {
    createTextChannel,
    createVoiceChannel
} from '../channelManager';

describe('Channel Manager', () => {
    let server, channelName;

    beforeEach(() => {
        server = {
            createChannel: jest.fn()
        }
    });

    describe('when a channel text channel is created', () => {
        beforeEach(() => {
            channelName = 'mytextchannel';
            createTextChannel(server, channelName);
        });

        it('should create the text channel', () => {
            expect(server.createChannel).toBeCalledWith(channelName, 'text');
        });
    });

    describe('when a voice channel is created', () => {
        beforeEach(() => {
            channelName = 'myvoicechannel';
            createVoiceChannel(server, channelName);
        });

        it('should create the voice channel', () => {
            expect(server.createChannel).toBeCalledWith(channelName, 'voice');
        });
    });
});