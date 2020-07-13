import { process } from '../actionProcessor';
import * as messagebroadcaster from '../messagebroadcaster';
import * as embedder from '../embedder';
import * as httpManager from '../httpManager';
import * as actionRepository from '../actionRepository';

describe('Action Processor', () => {
    let action, requester;

    beforeEach(() => {
        requester = 'requester';
        messagebroadcaster.broadcast = jest.fn();
        messagebroadcaster.broadcastToChannel = jest.fn();
        messagebroadcaster.broadcastTTSToChannel = jest.fn();
        messagebroadcaster.broadcastTTS = jest.fn();
        embedder.embedToChannel = jest.fn();
        httpManager.makeRequest = jest.fn(() => Promise.resolve());
        actionRepository.getAction = jest.fn(() => ({
            type: 'broadcast',
            message: 'Hello World'
        }));
    });

    describe('when action is a broadcast', () => {
        beforeEach(() => {
            action = {
                type: 'broadcast',
                message: 'Hello World'
            };
        });

        describe('when action is not TTS', () => {
            beforeEach(() => {
                process(action, requester);
            });

            it('should broadcast to channel', () => {
                expect(messagebroadcaster.broadcast).toHaveBeenCalledWith(action.message);
            });
        });

        describe('when action is TTS', () => {
            beforeEach(() => {
                action.tts = true;
                process(action, requester);
            });

            it('should broadcast TTS to channel', () => {
                expect(messagebroadcaster.broadcastTTS).toHaveBeenCalledWith(action.message);
            });
        });

        describe('when channel is provided', () => {
            beforeEach(() => {
                action.channel = 'general';
            });

            describe('and action is not TTS', () => {
                beforeEach(() => {
                    process(action, requester);
                });
    
                it('should broadcast to channel', () => {
                    expect(messagebroadcaster.broadcastToChannel).toHaveBeenCalledWith(action.message, action.channel);
                });
            });
    
            describe('and action is TTS', () => {
                beforeEach(() => {
                    action.tts = true;
                    process(action, requester);
                });
    
                it('should broadcast TTS to channel', () => {
                    expect(messagebroadcaster.broadcastTTSToChannel).toHaveBeenCalledWith(action.message, action.channel);
                });
            });
        });
    });

    describe('when action is a broadcastrandom', () => {
        const message = 'Sup';

        beforeEach(() => {
            action = {
                type: 'broadcastrandom',
                messages: [message]
            };
        });

        describe('when action is not TTS', () => {
            beforeEach(() => {
                process(action, requester);
            });

            it('should broadcast to channel', () => {
                expect(messagebroadcaster.broadcast).toHaveBeenCalledWith(message);
            });
        });

        describe('when action is TTS', () => {
            beforeEach(() => {
                action.tts = true;
                process(action, requester);
            });

            it('should broadcast TTS to channel', () => {
                expect(messagebroadcaster.broadcastTTS).toHaveBeenCalledWith(message);
            });
        });

        describe('when channel is provided', () => {
            beforeEach(() => {
                action.channel = 'general';
            });

            describe('and action is not TTS', () => {
                beforeEach(() => {
                    process(action, requester);
                });
    
                it('should broadcast to channel', () => {
                    expect(messagebroadcaster.broadcastToChannel).toHaveBeenCalledWith(message, action.channel);
                });
            });
    
            describe('and action is TTS', () => {
                beforeEach(() => {
                    action.tts = true;
                    process(action, requester);
                });
    
                it('should broadcast TTS to channel', () => {
                    expect(messagebroadcaster.broadcastTTSToChannel).toHaveBeenCalledWith(message, action.channel);
                });
            });
        });
    });

    describe('when action is an embed', () => {
        beforeEach(() => {
            action = {
                type: 'embed',
                channel: 'general',
                embed: 'someurl.png'
            };
            process(action);
        });

        it('should embed the image to the channel', () => {
            expect(embedder.embedToChannel).toHaveBeenCalledWith(action.channel, action.embed);
        });
    });

    describe('when action is a http action', () => {
        beforeEach(() => {
            action = {
                type: 'http',
                method: 'POST',
                url: 'someurl.com',
                body: 'somebody'
            };

            process(action);
        });

        it('should invoke a http request', () => {
            expect(httpManager.makeRequest).toHaveBeenCalledWith(action.method, action.url, action.body);
        });
    });

    describe('when action is a standard action', () => {
        beforeEach(() => {
            action = {
                type: 'standard',
                execute: jest.fn()
            };

            process(action, requester);
        });

        it('should invoke the action', () => {
            expect(action.execute).toHaveBeenCalledWith(action, requester);
        });
    });

    describe('when action is a multi action', () => {
        let action1, action2;

        beforeEach(() => {
            action1 = {
                type: 'standard',
                execute: jest.fn()
            };

            action2 = {
                type: 'standard',
                execute: jest.fn()
            };

            action = {
                type: 'multiaction',
                actions: [ action1, action2 ]
            };

            process(action, requester);
        });

        it('should invoke the first action', () => {
            expect(action1.execute).toHaveBeenCalled();
        });

        it('should invoke the second action', () => {
            expect(action2.execute).toHaveBeenCalled();
        });
    });

    describe('when action is an invoke action', () => {
        beforeEach(() => {
            action = {
                type: 'invokeaction',
                id: 'someid',
                server: 'someserver',
                execute: jest.fn()
            };

            process(action, requester);
        });

        it('should get the action', () => {
            expect(actionRepository.getAction).toHaveBeenCalledWith(action.id);
        });

        it('should broadcast', () => {
            expect(messagebroadcaster.broadcast).toHaveBeenCalledWith('Hello World');
        });
    });
});