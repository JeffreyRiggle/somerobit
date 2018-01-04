import {broadcastToChannel} from '../messagebroadcaster';
import {executeShutdown} from '../shutdownManager';

class ShutdownAction {
    get type() {
        return 'standard';
    }

    get help() {
        return 'Shuts down robit.';
    }

    execute(action, requester) {
        this._sendMessage('Shutting down robit', action, requester);
        executeShutdown();
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

export default new ShutdownAction();