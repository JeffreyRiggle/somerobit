import {broadcastToChannel} from './messagebroadcaster';

class HelpAction {
    get type() {
        return 'standard';
    }

    execute(action, channel) {
        if (!action.extraData) {
            return;
        }
    
        let act = getAction(action.extraData);
    
        if (!act || !act.help) {
            broadcastToChannel(`No help available for ${extraData}`);
            return;
        }
    
        broadcastToChannel(act.help, channel);
    }
}

export default new HelpAction();