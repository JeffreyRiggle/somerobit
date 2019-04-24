import {log} from './logging';

let actions = [];
let lastAction = null;

const addShutdownAction = action => {
    actions.push(action);
};

const executeShutdown = () => {
    for (let i = actions.length - 1; i >= 0; --i) {
        runAction(actions[i]);
    }
};

function runAction(action) {
    if (lastAction) {
        log('queueing action');
        lastAction.then(action);
        return;
    }

    lastAction = action();
}

export {
    addShutdownAction,
    executeShutdown
}