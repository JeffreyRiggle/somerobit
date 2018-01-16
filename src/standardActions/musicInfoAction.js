import {currentSongName} from '../audioController';
import MessageSender from './messageSender';

class StopMusicAction extends MessageSender {
    get type() {
        return 'standard';
    }

    get help() {
        return 'Gets information about the currently playing song.';
    }

    execute(action, requester) {
        this.sendMessageToChannel(`Current song is: ${currentSongName()}`, action, requester);
    }
}

export default new StopMusicAction();