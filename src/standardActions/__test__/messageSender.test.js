import MessageSender from '../messageSender';
import * as messageboadcaster from '../../messagebroadcaster';

describe('message sender', () => {
    let sender, requester, message, action;

    beforeEach(() => {
        requester = {
            sendMessage: jest.fn(() => Promise.resolve())
        };

        message = 'Some message';
        messageboadcaster.broadcastToChannel = jest.fn();
        sender = new MessageSender();
    });

    describe('when message is sent to requester', () => {
        beforeEach(() => {
            sender.sendMessageToRequester(message, requester);
        });

        it('should send the message', () => {
            expect(requester.sendMessage).toHaveBeenCalledWith(message);
        });
    });

    describe('when sending a message to a channel', () => {
        describe('and the action does not have a channel', () => {
            beforeEach(() => {
                action = {};
                sender.sendMessageToChannel(message, action, requester);
            });

            it('should send to the requester', () => {
                expect(requester.sendMessage).toHaveBeenCalledWith(message);
            });
        });

        describe('and the action does have a channel', () => {
            const channelName = 'foo';

            beforeEach(() => {
                action = {
                    channel: channelName
                };
                sender.sendMessageToChannel(message, action, requester);
            });

            it('should send to the requester', () => {
                expect(messageboadcaster.broadcastToChannel).toHaveBeenCalledWith(message, channelName);
            });
        });
    });
});