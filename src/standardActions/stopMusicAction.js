import {stop} from '../audioController';
import MessageSender from './messageSender';

class StopMusicAction extends MessageSender {
    get type() {
        return 'standard';
    }

    get help() {
        return 'stops playing music';
    }

    execute(action, requester) {
        stop();
        this.sendMessageToChannel('Music has been stopped', action, requester);
    }
}

export default new StopMusicAction();