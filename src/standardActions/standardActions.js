import {addAction} from '../actionRepository';
import help from './helpAction';
import playMusic from './playMusicAction';
import stopMusic from './stopMusicAction';
import musicInfo from './musicInfoAction';
import nextSong from './nextSongAction';
import shutdown from './shutdownAction';

let actions = [
    { 
        id: 'help',
        action: help
    },
    {
        id: 'playmusic',
        action: playMusic
    },
    {
        id: 'stopmusic',
        action: stopMusic
    },
    {
        id: 'currentsong',
        action: musicInfo
    },
    {
        id: 'nextsong',
        action: nextSong
    },
    {
        id: 'shutdown',
        action: shutdown
    }
];

actions.forEach((action, i, arr) => {
    addAction(action.id, action.action);
});