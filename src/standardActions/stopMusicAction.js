import {broadcastToChannel} from '../messagebroadcaster';
import {stop} from '../audioController';

class StopMusicAction {
    get type() {
        return 'standard';
    }

    get help() {
        return 'stops playing music';
    }

    execute(action, requester) {
        stop();
        this._sendMessage('Music has been stopped', action, requester);
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

export default new StopMusicAction();