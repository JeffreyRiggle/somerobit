import {createVoiceChannel} from '../channelManager';
import {setConnection, getConnection, play} from '../audioController';
import {addShutdownAction} from '../shutdownManager';
import MessageSender from './messageSender';

class PlayMusicAction extends MessageSender {
    get type() {
        return 'standard';
    }

    get help() {
        return 'starts playing music';
    }

    execute(action, requester) {
        if (getConnection()) {
            play(action.extraData);
            return;
        }

        return new Promise((resolve, reject) => {
            createVoiceChannel(action.server, 'Music').then(channel => {
                this.sendMessageToChannel('Music channel has been created', action, requester);

                addShutdownAction(() => {
                    return channel.delete().then(chan => {
                        console.log('Deleted channel');
                    }).catch(error => {
                        console.log(`Got error deleteing channel ${error}`);
                    });
                });

                this._startAudio(channel, action.extraData).then(() => {
                    resolve();
                });
            }).catch(error => {
                console.log(`Unable to create music channel ${error}`);
                reject(error);
            });
        });
    }

    _startAudio(channel, song) {
        console.log(`Attempting to join voice channel ${channel}`);

        return channel.join().then(connection => {
            console.log(`Joined voice channel ${channel}`);
            setConnection(connection);
            play(song);
        }).catch(error => {
            console.log(`Unable to join voice channel ${error}`);
        });
    }
}

export default new PlayMusicAction();