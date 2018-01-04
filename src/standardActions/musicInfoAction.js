import {broadcastToChannel} from '../messagebroadcaster';
import {currentSongName} from '../audioController';

class StopMusicAction {
    get type() {
        return 'standard';
    }

    get help() {
        return 'Gets information about the currently playing song.';
    }

    execute(action, requester) {
        this._sendMessage(`Current song is: ${currentSongName()}`, action, requester);
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