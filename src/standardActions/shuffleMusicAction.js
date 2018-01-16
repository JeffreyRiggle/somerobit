import {broadcastToChannel} from '../messagebroadcaster';
import {getConnection, shuffle} from '../audioController';

class ShuffleMusicAction {
    get type() {
        return 'standard';
    }

    get help() {
        return 'starts or stops shuffling music';
    }

    execute(action, requester) {
        if (!getConnection()) {
            this._sendMessage(`Unable to shuffle music. Music must be started first.`, action, requester);
            return;
        }

        let shuf = shuffle() ? 'now' : 'no longer';
        this._sendMessage(`Music is ${shuf} shuffled`, action, requester);
    }

    _sendMessage(message, action, requester) {
        if (action.channel) {
            broadcastToChannel(message, action.channel);
            delete action.channel;
            return;
        }

        requester.sendMessage(message).then(() => {
            console.log('Message sent');
        }).catch(err => {
            console.log('Failed to send message');
        });
    }
}

export default new ShuffleMusicAction();