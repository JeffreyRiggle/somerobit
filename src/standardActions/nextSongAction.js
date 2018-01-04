import {broadcastToChannel} from '../messagebroadcaster';
import {nextSong} from '../audioController';

class NextSongAction {
    get type() {
        return 'standard';
    }

    get help() {
        return 'Moves to the next song.';
    }

    execute(action, requester) {
        if (nextSong()) {
            this._sendMessage(`Moved to next song`, action, requester);
            return;
        }

        this._sendMessage('Unable to move to the next song', action, requester);
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

export default new NextSongAction();