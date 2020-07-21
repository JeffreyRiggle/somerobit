import StopMusicAction from '../stopMusicAction';
import * as audioController from '../../audioController';

describe('Stop music Action', () => {
    beforeEach(() => {
        audioController.stop = jest.fn();
    });

    it('should have the correct type', () => {
        expect(StopMusicAction.type).toBe('standard');
    });

    it('should have a help message', () => {
        expect(StopMusicAction.help).toEqual(expect.any(String));
    });

    describe('when executed', () => {
        let requester;

        beforeEach(() => {
            requester = {
                sendMessage: jest.fn(() => Promise.resolve())
            };
            const action = { };
            StopMusicAction.execute(action, requester);
        });

        it('should send the currect song to the channel', () => {
            expect(requester.sendMessage).toHaveBeenCalledWith('Music has been stopped');
        });

        it('should stop the music', () => {
            expect(audioController.stop).toHaveBeenCalled();
        });
    });
});