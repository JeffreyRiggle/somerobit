import { makeRequest } from '../httpManager';
import http from 'http';

describe('Http Manager', () => {
    let data, res, mockRequest, thrown;

    beforeEach(() => {
        mockRequest = {
            on: jest.fn(),
            write: jest.fn(),
            end: jest.fn()
        };

        http.request = jest.fn((options, callback) => {
            callback(res);

            return mockRequest;
        });

        res = {
            setEncoding: jest.fn(),
            on: jest.fn((event, callback) => {
                if (event === 'end') {
                    callback();
                }
            })
        };
    });

    describe('when standard request is made', () => {
        beforeEach((done) => {
            data = {
                some: 'value'
            };

            res.statusCode = 200;

            makeRequest('POST', 'http://someurl.com:4000', data).then(() => {
                thrown = false;
            }).catch(() => {
                thrown = true;
            }).finally(done);
        });

        it('should not throw', () => {
            expect(thrown).toBe(false);
        });

        it('should request with the correct options', () => {
            expect(http.request).toHaveBeenCalledWith(expect.objectContaining({
                host: 'someurl.com',
                port: 4000,
                method: 'POST'
            }), expect.any(Function));
        });

        it('should write the data', () => {
            expect(mockRequest.write).toHaveBeenCalledWith(JSON.stringify(data));
        });
    });

    describe('when the request fails', () => {
        beforeEach((done) => {
            data = {
                some: 'value'
            };

            res.statusCode = 404;

            makeRequest('POST', 'http://someurl.com:4000').then(() => {
                thrown = false;
            }).catch(() => {
                thrown = true;
            }).finally(done);
        });

        it('should throw', () => {
            expect(thrown).toBe(true);
        });

        it('should request with the correct options', () => {
            expect(http.request).toHaveBeenCalledWith(expect.objectContaining({
                host: 'someurl.com',
                port: 4000,
                method: 'POST'
            }), expect.any(Function));
        });

        it('should not write the data', () => {
            expect(mockRequest.write).not.toHaveBeenCalled();
        });
    });

    describe('when the request has no port', () => {
        beforeEach((done) => {
            data = {
                some: 'value'
            };

            res.statusCode = 200;

            makeRequest('POST', 'http://someurl.com').then(() => {
                thrown = false;
            }).catch(() => {
                thrown = true;
            }).finally(done);
        });

        it('should not be throw', () => {
            expect(thrown).toBe(false);
        });

        it('should request with the correct options', () => {
            expect(http.request).toHaveBeenCalledWith(expect.objectContaining({
                host: 'someurl.com',
                port: 80,
                method: 'POST'
            }), expect.any(Function));
        });

        it('should write the data', () => {
            expect(mockRequest.write).not.toHaveBeenCalled();
        });
    });
});