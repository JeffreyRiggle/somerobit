import {
    broadcast,
    broadcastTTS,
    broadcastToChannel,
    broadcastTTSToChannel
} from '../messagebroadcaster';
import * as channelCache from '../channelCache';

describe('message broadcaster', () => {
    let channelMap, channel1, channel2, message;

    beforeEach(() => {
        channel1 = {
            id: 'someChannel',
            send: jest.fn(() => Promise.resolve({
                content: 'response'
            }))
        };

        channel2 = {
            id: 'someotherChannel',
            send: jest.fn(() => Promise.resolve({
                content: 'response'
            }))
        };

        channelMap = new Map();
        channelMap.set(channel1.id, channel1);
        channelMap.set(channel2.id, channel2);
        channelCache.textChannelMap = jest.fn(() => channelMap);
    });

    describe('when broadcast is called', () => {
        beforeEach(() => {
            message = 'hello';
        });

        describe('and no channel ids are provided', () => {
            beforeEach(() => {
                broadcast(message);
            });

            it('should send to channel 1', () => {
                expect(channel1.send).toHaveBeenCalledWith(message);
            });

            it('should send to channel 2', () => {
                expect(channel2.send).toHaveBeenCalledWith(message);
            });
        });

        describe('and a channel id is provided', () => {
            beforeEach(() => {
                broadcast(message, [channel1.id]);
            });

            it('should send to channel 1', () => {
                expect(channel1.send).toHaveBeenCalledWith(message);
            });

            it('should not send to channel 2', () => {
                expect(channel2.send).not.toHaveBeenCalled();
            });
        });
    });

    describe('when broadcast tts is called', () => {
        beforeEach(() => {
            message = 'hello tts';
        });

        describe('and no channel ids are provided', () => {
            beforeEach(() => {
                broadcastTTS(message);
            });

            it('should send to channel 1', () => {
                expect(channel1.send).toHaveBeenCalledWith(message, expect.objectContaining({
                    tts: true
                }));
            });

            it('should send to channel 2', () => {
                expect(channel2.send).toHaveBeenCalledWith(message, expect.objectContaining({
                    tts: true
                }));
            });
        });

        describe('and a channel id is provided', () => {
            beforeEach(() => {
                broadcastTTS(message, [channel1.id]);
            });

            it('should send to channel 1', () => {
                expect(channel1.send).toHaveBeenCalledWith(message, expect.objectContaining({
                    tts: true
                }));
            });

            it('should not send to channel 2', () => {
                expect(channel2.send).not.toHaveBeenCalled();
            });
        });
    });

    describe('when broadcast to channel is called', () => {
        beforeEach(() => {
            message = 'hello broadcast';
            broadcastToChannel(message, channel1.id);
        });

        it('should send to channel1', () => {
            expect(channel1.send).toHaveBeenCalledWith(message);
        });

        it('should not send to channel2', () => {
            expect(channel2.send).not.toHaveBeenCalledWith(message);
        });
    });

    describe('when broadcast tts to channel is called', () => {
        beforeEach(() => {
            message = 'hello tts broadcast';
            broadcastTTSToChannel(message, channel1.id);
        });

        it('should send to channel1', () => {
            expect(channel1.send).toHaveBeenCalledWith(message, expect.objectContaining({
                tts: true
            }));
        });

        it('should not send to channel2', () => {
            expect(channel2.send).not.toHaveBeenCalledWith(message, expect.objectContaining({
                tts: true
            }));
        });
    });
});