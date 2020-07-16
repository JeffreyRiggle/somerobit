import {
    startListening,
    stopListening
} from '../messageListener';
import * as actionProcessor from '../actionProcessor';
import * as actionRepository from '../actionRepository';
import * as accessControl from '../accessControl';
import * as messagebroadcaster from '../messagebroadcaster';

describe('message listener', () => {
    let client, callbackMap, mockAction, message, hasAccess;

    beforeEach(() => {
        callbackMap = new Map();
        client = {
            on: (event, callback) => {
                callbackMap.set(event, callback);
            },
            off: (event) => {
                callbackMap.delete(event);
            }
        };

        message = {
            author: {
                userName: 'someuser',
                sendMessage: jest.fn(() => Promise.resolve())
            },
            channel: {
                id: 'somechannel'
            }
        };

        actionProcessor.process = jest.fn();
        actionRepository.getAction = jest.fn(() => mockAction);
        accessControl.hasAccess = jest.fn(() => hasAccess);
        accessControl.invalidAccessMessage = jest.fn(() => 'invalid');
        messagebroadcaster.broadcastToChannel = jest.fn();
    });

    describe('when start listen is called on a client', () => {
        beforeEach(() => {
            startListening(client);
        });

        it('should start listening', () => {
            expect(callbackMap.get('message')).toBeDefined();
        });

        describe('when a non actionable message is recieved', () => {
            beforeEach(() => {
                message.content = '!robs';
                callbackMap.get('message')(message);
            });

            it('should not process the message', () => {
                expect(actionProcessor.process).not.toHaveBeenCalled();
            });
        });

        describe('when actionable message is recieved but the action is invalid', () => {
            beforeEach(() => {
                message.content = '!robit invalid';
                callbackMap.get('message')(message);
            });

            it('should not process the message', () => {
                expect(actionProcessor.process).not.toHaveBeenCalled();
            });
        });

        describe('when actionable message is sent but user does not have permission', () => {
            beforeEach(() => {
                hasAccess = false;
                message.content = '!robit someaction';
                mockAction = { };
                callbackMap.get('message')(message);
            });

            it('should not process the message', () => {
                expect(actionProcessor.process).not.toHaveBeenCalled();
            });

            it('should send an invalid access warning', () => {
                expect(messagebroadcaster.broadcastToChannel).toHaveBeenCalledWith('invalid', message.channel.id);
            });
        });

        describe('when actionable message is sent but user does not have permission and no channel is used', () => {
            let original;
    
            beforeEach(() => {
                original = message.channel.id;
                delete message.channel.id;
                hasAccess = false;
                message.content = '!robit someaction';
                mockAction = { };
                callbackMap.get('message')(message);
            });

            afterEach(() => {
                message.channel.id = original;
            });

            it('should not process the message', () => {
                expect(actionProcessor.process).not.toHaveBeenCalled();
            });

            it('should send an invalid access warning', () => {
                expect(message.author.sendMessage).toHaveBeenCalledWith('invalid');
            });
        });

        describe('when actionable message is sent and user has permissions', () => {
            beforeEach(() => {
                hasAccess = true;
                message.content = '!robit someaction';
                mockAction = { };
            });

            describe('when action does not have a channel', () => {
                beforeEach(() => {
                    callbackMap.get('message')(message);
                });

                it('should set the channel', () => {
                    expect(mockAction.channel).toBe(message.channel.id);
                });

                it('should process the message', () => {
                    expect(actionProcessor.process).toHaveBeenCalledWith(mockAction, message.author);
                });
            });

            describe('when action does have a channel', () => {
                beforeEach(() => {
                    mockAction.channel = 'foobar';
                    callbackMap.get('message')(message);
                });

                it('should process the message', () => {
                    expect(actionProcessor.process).toHaveBeenCalledWith(mockAction, message.author);
                });
            });

            describe('when message has extra data', () => {
                beforeEach(() => {
                    message.content = '!robit someaction somedata';
                    callbackMap.get('message')(message);
                });

                it('should set the extra data', () => {
                    expect(mockAction.extraData).toBe('somedata');
                });

                it('should process the message', () => {
                    expect(actionProcessor.process).toHaveBeenCalledWith(mockAction, message.author);
                });
            });

            describe('when message has extra data and action is broadcast', () => {
                beforeEach(() => {
                    mockAction.type = 'broadcast';
                    message.content = '!robit someaction somedata';
                    callbackMap.get('message')(message);
                });

                it('should set the message', () => {
                    expect(mockAction.message).toBe('somedata');
                });

                it('should process the message', () => {
                    expect(actionProcessor.process).toHaveBeenCalledWith(mockAction, message.author);
                });
            });
        });

        describe('when stop listen is called on a client', () => {
            beforeEach(() => {
                stopListening(client);
            });

            it('should stop listening', () => {
                expect(callbackMap.get('message')).toBeUndefined();
            });
        });
    });
});