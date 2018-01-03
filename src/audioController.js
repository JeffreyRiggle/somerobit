import fs from 'fs';

var connection;
const validAudioFile = /\.(mp3|m4a|flac|wav)/i;
let audioFiles = new Map();
let currentSongIndex = 0;

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

const play = song => {
    if (!connection) {
        console.log('Unable to play song since connection does not exist');
        return;
    }

    let file = getAudioFile(song);

    console.log(`Attempting to play file ${file}`); 
    connection.playFile(file).once('end', () => {
        play();
    });
};

function getAudioFile(song) {
    if (song) {
        return audioFiles.get(song);
    }

    let iter = 0;
    let fileIter = audioFiles.values();

    while (iter < currentSongIndex) {
        fileIter.next();
        iter++;
    }

    let file = fileIter.next().value;
    currentSongIndex++;

    if (currentSongIndex > audioFiles.size) {
        currentSongIndex = 0;
    }

    return file;
};

const stop = () => {

};

export {
    setConnection,
    getConnection,
    addAudioFiles,
    play
};