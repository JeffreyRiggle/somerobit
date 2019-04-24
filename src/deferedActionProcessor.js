import moment from 'moment';
import {process} from './actionProcessor';
import {log} from './logging';

const processActions = actions => {
    actions.forEach((val, i, arr) => {
        if (val.timestamp) {
            setFutureTime(val);
            return;
        }

        if (val.daily) {
            setDailyTime(val);
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
        log('Invalid time provided: ' + action.timestamp);
        return;
    }

    let now = new Date();
    let futureTime = time.toDate() - now;

    if (futureTime < 0) {
        return;
    }
    
    setTimeout(() => {
        process(action.action);

        if (action.reoccuring) {
            setFutureTime(action);
        }
    }, futureTime);
};

const setDailyTime = action => {
    let time = moment(action.daily, 'HH:mm:ss');

    if (!time.isValid()) {
        log('Invalid time provided: ' + action.timestamp);
        return;
    }

    let now = new Date();
    let futureTime = time.toDate() - now;

    if (futureTime < 0) {
        time.add(1, 'days');
        futureTime = time.toDate() - now;
    }
    
    log(`Queuing action for ${time.format('YYYY-MM-DD HH:mm')}`);

    setTimeout(() => {
        process(action.action);

        setDailyTime(action);
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