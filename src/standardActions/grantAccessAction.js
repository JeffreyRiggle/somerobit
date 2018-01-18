import MessageSender from './messageSender';
import {grantAccess, fullAccess} from '../accessControl';

const userReg = /-u\s+([^\s"]+)|-u\s+"([^"]*)"/i;
const singleAccessReg = /-a\s+([^\s\[]+)/i;
const arrayAccessReg = /-a\s+\[([^\]]+)\]/i;

class GrantAccessAction extends MessageSender {
    get type() {
        return 'standard';
    }

    get help() {
        return 'Gives a user access to actions'
    }

    get accessOverride() {
        return fullAccess;
    }

    execute(action, requester) {
        let user = this._getUser(action.extraData);
        let access = this._getAccess(action.extraData);

        if (!user || !access) {
            this.sendMessageToRequester('Invalid request see help for usage', requester);
            return;
        }

        console.log(`attempting to give ${user} rights ${access}`);
        grantAccess(user, access);
    }

    _getUser(args) {
        let match = args.match(userReg);
        if (!match || match.length < 1) {
            return;
        }

        return match[1];
    }

    _getAccess(args) {
        let match = args.match(singleAccessReg);
        if (match && match.length > 0) {
            return [match[1]];
        }

        match = args.match(arrayAccessReg);
        if (!match || match.length < 1) {
            return;
        }

        return match[1].split(', ');
    }
}

export default new GrantAccessAction();