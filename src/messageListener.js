import {getAction} from './actionRepository';
import {process} from './actionProcessor';

const actionReg = /^!robit\s+([^\s]*)/i;
const extraDataReg = /!robit\s+[^\s]*\s(.*)/i;

const startListening = client => {
    client.on('message', processMessage);
};

const stopListening = client => {
    client.off('message');
};

const processMessage = message => {
    console.log(`(Channel ${message.channel.id}) ${message.author.username}: ${message.content}`);
    let actionMatch = message.content.match(actionReg);

    if (!actionMatch || actionMatch.length < 2) {
        console.log(`ignoring message ${message.content}`);
        return;
    }

    let action = getAction(actionMatch[1]);

    if (!action) {
        console.log(`unable to find action ${actionMatch[1]}`);
        return;
    }

    let extraDataMatch = message.content.match(extraDataReg);

    if (!action.channel) {
        action.channel = message.channel.id;
    }

    action.server = message.guild;
    
    if (action.type === 'broadcast' && !action.message && extraDataMatch && extraDataMatch.length >= 2) {
        action.message = extraDataMatch[1];
    } else if (extraDataMatch && extraDataMatch.length >= 2){
        action.extraData = extraDataMatch[1];
    }

    process(action, message.author);
};

export {
    startListening,
    stopListening
}