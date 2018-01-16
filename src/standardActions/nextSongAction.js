import {nextSong} from '../audioController';
import MessageSender from './messageSender';

class NextSongAction extends MessageSender {
    get type() {
        return 'standard';
    }

    get help() {
        return 'Moves to the next song.';
    }

    execute(action, requester) {
        if (nextSong()) {
            this.sendMessageToChannel(`Moved to next song`, action, requester);
            return;
        }

        this.sendMessageToChannel('Unable to move to the next song', action, requester);
    }
}

export default new NextSongAction();