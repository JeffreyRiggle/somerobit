import {addAction} from './actionRepository';
import help from './helpAction';

let actions = [
    { 
        id: "help",
        action: help
    }
];

actions.forEach((action, i, arr) => {
    addAction(action.id, action.action);
});