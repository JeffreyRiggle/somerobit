import fs from 'fs';
import express from 'express';
import bodyParser from 'body-parser';
import {startServer, getState} from './server';
import {executeShutdown} from './shutdownManager';
import {setWatching, log, flush} from './logging';
import './standardActions/standardActions';
import 'opusscript';

const app = express();
let configFile;

process.argv.forEach((val, i, arr) => {
    if (val.endsWith('json')) {
        configFile = val;
    }
});

app.use(bodyParser.json());
app.listen(8080);

app.post('/robit/start', (req, res) => {
    if (!req.body.token) {
        res.status(400).send({
            errorDetail: 'Token is required'
        });
        return;
    }

    setWatching(true);
    startServer(req.body).then((state) => {
        res.status(200).send({
            status: state
        });
    }).catch((err) => {
        res.status(500).send({
            errorDetail: err
        });
    });
});

app.post('/robit/stop', (req, res) => {
    setTimeout(() => {
        executeShutdown();
    });

    res.status(200).send({
        state: 'Terminated'
    });
});

app.get('/robit/state', (req, res) => {
    res.status(200).send({
        state: getState()
    });
});

app.get('/robit/logging', (req, res) => {
    res.status(200).send(flush());
});

if (!configFile) {
    log('No Config provided');
} else {
    fs.readFile(configFile, 'utf8', (err, data) => {
        if (err) {
            log('Got error ' + err);
            return;
        }
    
        startServer(JSON.parse(data)).catch(err => {
            log('Provided config file was wrong shutting down.');
            process.exit(1);
        });
    });
}