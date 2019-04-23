import {getAction} from './actionRepository';
import {process} from './actionProcessor';
import {hasAccess, invalidAccessMessage} from './accessControl';
import {broadcastToChannel} from './messagebroadcaster';
import {log} from './logging';

const actionReg = /^!robit\s+([^\s]*)/i;
const extraDataReg = /!robit\s+[^\s]*\s(.*)/i;

const startListening = client => {
    client.on('message', processMessage);
};

const stopListening = client => {
    client.off('message');
};

function processMessage(message) {
    log(`(Channel ${message.channel.id}) ${message.author.username}: ${message.content}`);
    let actionMatch = message.content.match(actionReg);

    if (!actionMatch || actionMatch.length < 2) {
        log(`ignoring message ${message.content}`);
        return;
    }

    let action = getAction(actionMatch[1]);

    if (!action) {
        log(`unable to find action ${actionMatch[1]}`);
        return;
    }

    let requiredAccess = action.accessOverride ? action.accessOverride : actionMatch[1];
    if (!hasAccess(message.author.username, requiredAccess)) {
        sendMessage(invalidAccessMessage(), message.channel.id, message.author);
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

function sendMessage(message, channel, requester) {
    if (channel) {
        broadcastToChannel(message, channel);
        return;
    }

    requester.sendMessage(message).then(() => {
        log('Message sent');
    }).catch(err => {
        log('Failed to send message');
    });
};

export {
    startListening,
    stopListening
}