import http from 'http';

const hostReg = /http:\/\/([^:\/]*)|https:\/\/([^:\/]*)|^([^:\/]*)/i;
const portReg = /http:\/\/[^:]*:([^\/]*)|https:\/\/[^:]*:([^\/]*)|^[^:]*:([^\/]*)/i;
const pathReg = /http:\/\/[^:]*[^\/]*(.*)|https:\/\/[^:]*[^\/]*(.*)|^[^:]*[^\/]*(.*)/i;

const makeRequest = (method, url, data) => {
    return new Promise((resolve, reject) => {
        const options = {
            host: getHost(url),
            port: getPort(url),
            path: getPath(url),
            method: method,
            headers: {
                'Content-Type': 'application/json'
            }
        }

        console.log(`sending request ${JSON.stringify(options)}`);

        let request = http.request(options, res => {
            if (res.statusCode <= 200 || res.statusCode >= 300) {
                reject();
                return;
            }

            let response = '';

            res.setEncoding('utf8');
            res.on('data', chunk => {
                response += chunk;
            });

            res.on('end', chunk => {
                resolve(response);
            });
        });

        request.on('error', error => {
            reject(error);
        });

        if (data) {
            request.write(JSON.stringify(data));
        }

        request.end();
    });
};

const getHost = url => {
    let match = url.match(hostReg);

    if (match.length < 2) {
        return '';
    }

    return match[1];
};

const getPort = url => {
    let match = url.match(portReg);

    if (match.length < 2) {
        return 80;
    }

    return parseInt(match[1]);
};

const getPath = url => {
    let match = url.match(pathReg);

    if (match.length < 2) {
        return '';
    }

    return match[1];
};

export {
    makeRequest
}