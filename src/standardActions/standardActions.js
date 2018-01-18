import {addAction} from '../actionRepository';
import help from './helpAction';
import playMusic from './playMusicAction';
import stopMusic from './stopMusicAction';
import musicInfo from './musicInfoAction';
import nextSong from './nextSongAction';
import shutdown from './shutdownAction';
import shuffleMusic from './shuffleMusicAction';
import grantAccess from './grantAccessAction';
import userAccess from './userAccessAction';
import revokeAccess from './revokeAccessAction';
import {addPossibleAccess} from '../accessControl';

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
        id: 'shufflemusic',
        action: shuffleMusic
    },
    {
        id: 'shutdown',
        action: shutdown
    },
    {
        id: 'grantaccess',
        action: grantAccess
    },
    {
        id: 'revokeaccess',
        action: revokeAccess
    },
    {
        id: 'useraccess',
        action: userAccess
    }
];

let ids = [];
actions.forEach((action, i, arr) => {
    ids.push(action.id);
    addAction(action.id, action.action);
});

addPossibleAccess(ids);