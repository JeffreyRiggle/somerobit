import ShutdownAction from '../shutdownAction';
import * as shutdownManager from '../../shutdownManager';
import * as messageboadcaster from '../../messagebroadcaster';

describe('shutdown action', () => {
    beforeEach(() => {
        messageboadcaster.broadcastToChannel = jest.fn();
        shutdownManager.executeShutdown = jest.fn();
    });

    it('should have the correct type', () => {
        expect(ShutdownAction.type).toBe('standard');
    });

    it('should have a help message', () => {
        expect(ShutdownAction.help).toEqual(expect.any(String));
    });

    describe('when action is executed', () => {
        const channelName = 'foo';
        let action, requester;

        beforeEach(() => {
            action = {
                channel: channelName
            };

            requester = {
                sendMessage: jest.fn()
            };

            ShutdownAction.execute(action, requester);
        });

        it('should send a message to the channel', () => {
            expect(messageboadcaster.broadcastToChannel).toHaveBeenCalledWith(expect.any(String), channelName);
        });

        it('should shutdown the application', () => {
            expect(shutdownManager.executeShutdown).toHaveBeenCalled();
        });
    });
});