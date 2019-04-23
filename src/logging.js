let watching = false;
let batchedLogs = [];

const setWatching = (watch) => {
    watching = watch;
}

const log = (message) => {
    if (watching) {
        batchedLogs.push(message);
    }

    console.log(message);
}

const flush = () => {
    let retVal = batchedLogs;
    batchedLogs = [];

    return retVal;
}

module.exports = {
    setWatching,
    log,
    flush
}