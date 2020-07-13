import {embedToChannel} from '../embedder';
import * as channelCache from '../channelCache';

describe('embedder', () => {
    let channelMap, channel, data;

    beforeEach(() => {
        data = 'someurl.png';

        channel = {
            id: 'someChannel',
            send: jest.fn(() => Promise.resolve())
        };

        channelMap = new Map();
        channelMap.set(channel.id, channel);
        channelCache.textChannelMap = jest.fn(() => channelMap);
    });

    describe('when a unknown channel is used', () => {
        beforeEach(() => {
            embedToChannel('foochannel', data);
        });

        it('should not invoke the channel', () => {
            expect(channel.send).not.toHaveBeenCalled();
        });
    });

    describe('when known channel is used', () => {
        beforeEach(() => {
            embedToChannel(channel.id, data);
        });

        it('should invoke the channel', () => {
            expect(channel.send).toHaveBeenCalled();
        });
    });
});