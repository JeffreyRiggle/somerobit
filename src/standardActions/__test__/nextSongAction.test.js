import NextSongAction from '../nextSongAction';
import * as audioController from '../../audioController';

describe('Next Song Action', () => {
    let mockHasNextSong;

    beforeEach(() => {
        audioController.nextSong = jest.fn(() => mockHasNextSong);
    });

    it('should have the correct type', () => {
        expect(NextSongAction.type).toBe('standard');
    });

    it('should have a help message', () => {
        expect(NextSongAction.help).toEqual(expect.any(String));
    });

    describe('when executed', () => {
        let requester, action;

        beforeEach(() => {
            requester = {
                sendMessage: jest.fn(() => Promise.resolve())
            };
            action = { };
        });

        describe('when there is a next song', () => {
            beforeEach(() => {
                mockHasNextSong = true;
                NextSongAction.execute(action, requester);
            });

            it('should send a moved message', () => {
                expect(requester.sendMessage).toHaveBeenCalledWith('Moved to next song');
            });
        });

        describe('when there is not a next song', () => {
            beforeEach(() => {
                mockHasNextSong = false;
                NextSongAction.execute(action, requester);
            });

            it('should send an error message', () => {
                expect(requester.sendMessage).toHaveBeenCalledWith('Unable to move to the next song');
            });
        });
    });
});