import {
    addChannel,
    removeChannel,
    clearChannels,
    textChannelMap
} from '../channelCache';

describe('channel cache', () => {
    let channel1, channel2, channel3;

    beforeEach(() => {
        channel1 = {
            id: 'channel1',
            type: 'voice'
        };

        channel2 = {
            id: 'channel2',
            type: 'text'
        };

        channel3 = {
            id: 'channel3',
            type: 'text'
        };
    });

    describe('when a voice channel is added', () => {
        beforeEach(() => {
            addChannel(channel1);
        });

        it('should not show up in the text channels', () => {
            expect(textChannelMap().size).toBe(0);
        });
        
        describe('when a text channel is added', () => {
            beforeEach(() => {
                addChannel(channel2);
            });

            it('should show up in the text channels', () => {
                expect(textChannelMap().size).toBe(1);
            });

            describe('when another text channel is added', () => {
                beforeEach(() => {
                    addChannel(channel3);
                });

                it('should show up in the text channels', () => {
                    expect(textChannelMap().get(channel3.id)).toBe(channel3);
                });

                describe('when the first text channel is removed', () => {
                    beforeEach(() => {
                        removeChannel(channel2);
                    });

                    it('should no longer be in the text channels', () => {
                        expect(textChannelMap().get(channel2.id)).toBe(undefined);
                    });
                });

                describe('when channels are cleared', () => {
                    beforeEach(() => {
                        clearChannels();
                    });

                    it('should no longer have text channels', () => {
                        expect(textChannelMap().size).toBe(0);
                    });
                });
            });
        });
    });
});