import PlayMusicAction from '../playMusicAction';
import * as audioController from '../../audioController';
import * as channelManager from '../../channelManager';

describe('Play Music Action', () => {
    let mockConnection, mockCreateVoiceChannel;

    beforeEach(() => {
        audioController.getConnection = jest.fn(() => mockConnection);
        audioController.play = jest.fn();
        audioController.setConnection = jest.fn();
        channelManager.createVoiceChannel = jest.fn(() => mockCreateVoiceChannel);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should have the correct type', () => {
        expect(PlayMusicAction.type).toBe('standard');
    });

    it('should have a help message', () => {
        expect(PlayMusicAction.help).toEqual(expect.any(String));
    });

    describe('when executed', () => {
        let requester, action;
        beforeEach(() => {
            requester = {
                sendMessage: jest.fn(() => Promise.resolve())
            };
            action = { };
        });

        describe('when a connection exists', () => {
            beforeEach(() => {
                mockConnection = {};
                PlayMusicAction.execute(action, requester);
            });

            it('should play using the audio controller', () => {
                expect(audioController.play).toHaveBeenCalled();
            });
        });

        describe('when connection does not exist', () => {
            let failed;

            beforeEach(() => {
                mockConnection = undefined;
            });

            describe('and create channel fails', () => {
                beforeEach((done) => {
                    mockCreateVoiceChannel = Promise.reject();
                    PlayMusicAction.execute(action, requester).catch(err => {
                        failed = true;
                    }).finally(done);
                });

                it('should not play using the audio controller', () => {
                    expect(audioController.play).not.toHaveBeenCalled();
                });

                it('should fail', () => {
                    expect(failed).toBe(true);
                });
            });

            describe('and create channel passes', () => {
                let resolveChannel, resolveConnection;

                beforeEach((done) => {
                    resolveConnection = {};

                    resolveChannel = {
                        join: jest.fn(() => Promise.resolve(resolveConnection))
                    };

                    mockCreateVoiceChannel = Promise.resolve(resolveChannel);
                    PlayMusicAction.execute(action, requester).then(() => {
                        failed = false;
                    }).catch(err => {
                        failed = true;
                    }).finally(done);
                });

                it('should not fail', () => {
                    expect(failed).toBe(false)
                });

                it('should join the channel', () => {
                    expect(resolveChannel.join).toHaveBeenCalled();
                });

                it('should set the connection', () => {
                    expect(audioController.setConnection).toHaveBeenCalledWith(resolveConnection);
                });

                it('should play the music', () => {
                    expect(audioController.play).toHaveBeenCalled();
                });
            });
        });
    });
});