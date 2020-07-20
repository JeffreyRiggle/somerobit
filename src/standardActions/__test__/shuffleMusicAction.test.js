import ShuffleMusicAction from '../shuffleMusicAction';
import * as audioController from '../../audioController';

describe('Shuffle Music Action', () => {
    let mockShuffle, mockConnection;

    beforeEach(() => {
        audioController.shuffle = jest.fn(() => mockShuffle);
        audioController.getConnection = jest.fn(() => mockConnection);
    });

    it('should have the correct type', () => {
        expect(ShuffleMusicAction.type).toBe('standard');
    });

    it('should have a help message', () => {
        expect(ShuffleMusicAction.help).toEqual(expect.any(String));
    });

    describe('when executed', () => {
        let requester, action;

        beforeEach(() => {
            requester = {
                sendMessage: jest.fn(() => Promise.resolve())
            };
            action = { };
        });

        describe('and there is a connection', () => {
            beforeEach(() => {
                mockConnection = {};
            });

            describe('when music is shuffled', () => {
                beforeEach(() => {
                    mockShuffle = false;
                    ShuffleMusicAction.execute(action, requester);
                });
    
                it('should send a stop shuffle message', () => {
                    expect(requester.sendMessage).toHaveBeenCalledWith('Music is no longer shuffled');
                });
            });
    
            describe('when music is not shuffled', () => {
                beforeEach(() => {
                    mockShuffle = true;
                    ShuffleMusicAction.execute(action, requester);
                });
    
                it('should send a shuffle message', () => {
                    expect(requester.sendMessage).toHaveBeenCalledWith('Music is now shuffled');
                });
            });
        });

        describe('when there is no connection', () => {
            beforeEach(() => {
                mockConnection = undefined;
                ShuffleMusicAction.execute(action, requester);
            });

            it('should send an error message', () => {
                expect(requester.sendMessage).toHaveBeenCalledWith('Unable to shuffle music. Music must be started first.');
            });
        });
    });
});