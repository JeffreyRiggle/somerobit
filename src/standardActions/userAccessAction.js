import MessageSender from './messageSender';
import {fullAccess, userAccess, hasAccess} from '../accessControl';

class UserAccessAction extends MessageSender {
    get type() {
        return 'standard';
    }

    get help() {
        return 'Gets a users access to actions'
    }

    execute(action, requester) {
        if (action.extraData && !hasAccess(requester.username, fullAccess)) {
            this.sendMessageToRequester(`You do not have access to view access of user ${action.extraData}`, requester);
            return;
        }

        let user = action.extraData ? action.extraData : requester.username;
        let access = userAccess(user);

        if (!access) {
            access = 'Nothing';
        } else {
            access = access.join(', ');
        }

        this.sendMessageToRequester(`${user} has access to ${access}`, requester);
    }
}

export default new UserAccessAction();