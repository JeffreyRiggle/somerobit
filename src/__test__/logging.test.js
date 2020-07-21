import {
    setWatching,
    log,
    flush
} from '../logging';

describe('Logging', () => {
    describe('when watcher is not set and log is sent', () => {
        beforeEach(() => {
            log('this is a test');
        });

        it('should not batch logs', () => {
            expect(flush().length).toBe(0);
        });
    });

    describe('when watcher is set', () => {
        beforeEach(() => {
            setWatching(true);
        });

        describe('when log is sent', () => {
            beforeEach(() => {
                log('This is a different test');
            });

            it('should batch logs', () => {
                expect(flush().length).toBe(1);
            });
        });
    });
});