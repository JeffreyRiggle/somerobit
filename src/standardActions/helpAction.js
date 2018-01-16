import {getAction, getActions} from '../actionRepository';
import MessageSender from './messageSender';

class HelpAction extends MessageSender {
    get type() {
        return 'standard';
    }

    get help() {
        return `Command used to display information about other commands.
        Usage: help {command name here}
        Available commands: ${this.getCommands()}`;
    }

    getCommands() {
        var retVal = '';
        getActions().forEach((value, key, map) => {
            retVal += key + ' ';
        });

        return retVal;
    }

    execute(action, requester) {
        if (!action.extraData) {
            this.sendMessageToRequester(this.help, requester);
            return;
        }
    
        let act = getAction(action.extraData);
    
        if (!act || !act.help) {
            this.sendMessageToRequester(`No help available for ${action.extraData}`, requester);
            return;
        }
    
        this.sendMessageToRequester(act.help, requester);
    }
}

export default new HelpAction();