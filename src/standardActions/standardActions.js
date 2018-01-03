import {addAction} from '../actionRepository';
import help from './helpAction';
import playMusic from './playMusicAction';

let actions = [
    { 
        id: 'help',
        action: help
    },
    {
        id: 'playmusic',
        action: playMusic
    }
];

actions.forEach((action, i, arr) => {
    addAction(action.id, action.action);
});