import {getConnection, shuffle} from '../audioController';
import MessageSender from './messageSender';

class ShuffleMusicAction extends MessageSender {
    get type() {
        return 'standard';
    }

    get help() {
        return 'starts or stops shuffling music';
    }

    execute(action, requester) {
        if (!getConnection()) {
            this.sendMessageToChannel(`Unable to shuffle music. Music must be started first.`, action, requester);
            return;
        }

        let shuf = shuffle() ? 'now' : 'no longer';
        this.sendMessageToChannel(`Music is ${shuf} shuffled`, action, requester);
    }
}

export default new ShuffleMusicAction();