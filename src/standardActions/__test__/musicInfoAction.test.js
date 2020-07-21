import MusicInfoAction from '../musicInfoAction';
import * as audioController from '../../audioController';

describe('Music Info Action', () => {
    beforeEach(() => {
        audioController.currentSongName = jest.fn(() => 'somesong.mp3')
    });

    it('should have the correct type', () => {
        expect(MusicInfoAction.type).toBe('standard');
    });

    it('should have a help message', () => {
        expect(MusicInfoAction.help).toEqual(expect.any(String));
    });

    describe('when executed', () => {
        let requester;

        beforeEach(() => {
            requester = {
                sendMessage: jest.fn(() => Promise.resolve())
            };
            const action = { };
            MusicInfoAction.execute(action, requester);
        });

        it('should send the currect song to the channel', () => {
            expect(requester.sendMessage).toHaveBeenCalledWith('Current song is: somesong.mp3');
        });
    });
});