import {getAction, getActions} from '../actionRepository';

class HelpAction {
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
            this.sendMessage(this.help, requester);
            return;
        }
    
        let act = getAction(action.extraData);
    
        if (!act || !act.help) {
            this.sendMessage(`No help available for ${action.extraData}`, requester);
            return;
        }
    
        this.sendMessage(act.help, requester);
    }

    sendMessage(message, requester) {
        requester.sendMessage(message).then(() => {
            console.log('Message sent');
        }).catch(err => {
            console.log('Failed to send message');
        });
    }
}

export default new HelpAction();