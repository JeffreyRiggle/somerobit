import fs from 'fs';
import { URL } from 'url';
import { homedir } from 'os';
import request from 'request';
import validUrl from 'valid-url';
import {log} from './logging';

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
    if (!validUrl.isUri(dir)) {
        log(`Searching ${dir} for audio files`);
        getMusicFilesFromDirectory(dir);
        return;
    }
    
    log(`Getting music files from uri ${dir}`);
    getMusicFilesFromURI(dir);
};

function getMusicFilesFromURI(uri) {
    const url = new URL(uri);
    let fileName = url.pathname;
    fileName = fileName.substring(fileName.lastIndexOf('/') + 1, fileName.length);
    let workingDir = `${homedir()}/robit`;
    let path = `${workingDir}/${fileName}`;

    if (!fs.existsSync(workingDir)) {
        fs.mkdirSync(workingDir);
    }

    downloadFile(uri, path).then(() => {
        addMusicFile(fileName, path);
    });
}

function downloadFile(uri, fileName) {
    return new Promise((resolve, reject) => {
        let r = request(uri).pipe(fs.createWriteStream(fileName));
        r.on('close', () => {
            resolve();
        });
        r.on('error', error => {
            reject(error);
        });
    })
}

function addMusicFile(file, path) {
    if (!validAudioFile.test(file)) {
        return;
    }

    let index = file.lastIndexOf('.');
    let name = file;

    if (index !== -1) {
        name = file.substring(0, index);
    }

    log(`Adding file ${name} with path ${path}`);
    audioFiles.set(name, path);
}

function getMusicFilesFromDirectory(dir) {
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

        addMusicFile(file, path);
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
        log('Unable to play song since connection does not exist');
        return;
    }

    stopped = false;
    let file = getAudioFile(song);

    log(`Attempting to play file ${file.value[1]}`);
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
        log(`Attempting to get file for ${song}`);
        return audioFiles.get(song);
    }

    let targetIndex = currentSongIndex;

    if (shuffled) {
        log('Shuffle is on getting shuffled song.');
        targetIndex = Math.floor(Math.random() * audioFiles.size);
    }

    let iter = 1;
    let fileIter = audioFiles.entries();

    while (iter < targetIndex) {
        log('Finding next song');
        fileIter.next();
        iter++;
    }

    let file = fileIter.next();

    if (shuffled) {
        return file;
    }

    log('upping next song');
    currentSongIndex++;

    if (currentSongIndex > audioFiles.size) {
        log('reseting song to first.');
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