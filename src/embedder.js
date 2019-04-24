import {textChannelMap} from './channelCache';
import {log} from './logging';

const embedToChannel = (id, data) => {
    let channels = textChannelMap();

    let channel = channels.get(id);

    if (!channel) {
        return;
    }

    channel.send('', {embed: data}).then(message => {
        log('Sent embed.');
    }).catch(error => {
        log('Got error ' + error);
    });
}

export {
    embedToChannel
}