import {textChannelMap} from './channelCache';

const embedToChannel = (id, data) => {
    let channels = textChannelMap();

    let channel = channels.get(id);

    if (!channel) {
        return;
    }

    channel.send('', {embed: data}).then(message => {
        console.log('Sent embed.');
    }).catch(error => {
        console.log('Got error ' + error);
    });
}

export {
    embedToChannel
}