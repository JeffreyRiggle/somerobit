import {broadcastToChannel} from '../messagebroadcaster';
import {log} from '../logging';

class MessageSender {
    sendMessageToRequester(message, requester) {
        requester.sendMessage(message).then(() => {
            log('Message sent');
        }).catch(err => {
            log('Failed to send message');
        });
    }

    sendMessageToChannel(message, action, requester) {
        if (action.channel) {
            broadcastToChannel(message, action.channel);
            delete action.channel;
            return;
        }

        requester.sendMessage(message).then(() => {
            log('Message sent');
        }).catch(err => {
            log('Failed to send message');
        });
    }
}

export default MessageSender;