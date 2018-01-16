import {executeShutdown} from '../shutdownManager';
import MessageSender from './messageSender';

class ShutdownAction extends MessageSender {
    get type() {
        return 'standard';
    }

    get help() {
        return 'Shuts down robit.';
    }

    execute(action, requester) {
        this.sendMessageToChannel('Shutting down robit', action, requester);
        executeShutdown();
    }
}

export default new ShutdownAction();