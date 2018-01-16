import fs from 'fs';

var connection;
const validAudioFile = /\.(mp3|m4a|flac|wav)/i;
let audioFiles = new Map();
let currentSongIndex = 0;
let stopped = false;
let shuffled = false;
let currentSong = {};

const setConnection = conn => {
    connection = conn;
};

const getConnection = () => {
    return connection;
};

const addAudioFiles = dir => {
    console.log(`Searching ${dir} for audio files`);
    getMusicFiles(dir);
};

function getMusicFiles(dir) {
    let files = fs.readdirSync(dir);

    files.forEach(file => {
        let path = `${dir}/${file}`;
        if (fs.statSync(path).isDirectory()) {
            walkDir(path);
            return;
        }

        if (!validAudioFile.test(file)) {
            return;
        }

        let index = file.lastIndexOf('.');
        let name = file;

        if (index !== -1) {
            name = file.substring(0, index);
        }

        console.log(`Adding file ${name} with path ${path}`);
        audioFiles.set(name, path);
    });
};

const shuffle = () => {
    shuffled = !shuffled;

    if (stopped) {
        play();
    }

    return shuffled;
};

const play = song => {
    if (!connection) {
        console.log('Unable to play song since connection does not exist');
        return;
    }

    stopped = false;
    let file = getAudioFile(song);

    console.log(`Attempting to play file ${file.value[1]}`);
    currentSong.name = file.value[0];
    currentSong.stream = connection.playFile(file.value[1]);
    currentSong.stream.once('end', () => {
        if (!stopped) {
            play();
        }
    });
};

function getAudioFile(song) {
    if (song) {
        return audioFiles.get(song);
    }

    let targetIndex = currentSongIndex;

    if (shuffled) {
        targetIndex = Math.floor(Math.random() * audioFiles.size);
    }

    let iter = 0;
    let fileIter = audioFiles.entries();

    while (iter < targetIndex) {
        fileIter.next();
        iter++;
    }

    let file = fileIter.next();

    if (shuffled) {
        return file;
    }

    currentSongIndex++;

    if (currentSongIndex > audioFiles.size) {
        currentSongIndex = 0;
    }

    return file;
};

const stop = () => {
    stopped = true;
    if (currentSong.stream) {
        currentSong.stream.end('User ended song');
        currentSong = {};
    }
};

const currentSongName = () => {
    if (currentSong.name) {
        return currentSong.name;
    }

    if (stopped) {
        return 'No song is playing.';
    }

    return 'Unknown';
};

const nextSong = () => {
    if (stopped) {
        return false;
    }

    if (!currentSong.stream) {
        return false;
    }

    currentSong.stream.end('User invoked next song');
    return true;
};

export {
    setConnection,
    getConnection,
    addAudioFiles,
    play,
    shuffle,
    stop,
    nextSong,
    currentSongName
};