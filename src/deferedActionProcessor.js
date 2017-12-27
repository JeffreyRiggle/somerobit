import moment from 'moment';
import {process} from './actionProcessor';

const processActions = actions => {
    actions.forEach((val, i, arr) => {
        if (val.timestamp) {
            setFutureTime(val);
            return;
        }

        if (val.reoccuring) {
            setReoccuring(val);
            return;
        }

        setDelay(val);
    });
};

const setFutureTime = action => {
    let time = moment(action.timestamp);

    if (!time.isValid()) {
        console.log('Invalid time provided: ' + action.timestamp);
        return;
    }

    let now = new Date();
    let futureTime = time.toDate() - now;

    if (futureTime < 0) {
        return;
    }
    
    setTimeout(() => {
        process(action.action);
    }, futureTime);
};

const setReoccuring = action => {
    setInterval(() => {
        process(action.action);
    }, action.delay);
};

const setDelay = action => {
    setTimeout(() => {
        process(action.action);
    }, action.delay);
};

export {
    processActions
}