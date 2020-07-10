import {
    addShutdownAction,
    executeShutdown
} from '../shutdownManager';

describe('Shutdown Manager', () => {
    let ran;

    beforeEach(() => {
        ran = false;
    });

    describe('when shutdown actions are added', () => {
        beforeEach(() => {
            addShutdownAction(() => Promise.resolve());
            addShutdownAction(() => {
                ran = true;
                return Promise.resolve();
            });
        });

        it('should not execute the action', () => {
            expect(ran).toBe(false);
        });

        describe('when shutdown occurs', () => {
            beforeEach(() => {
                executeShutdown();
            });

            it('should run the action', () => {
                expect(ran).toBe(true);
            });
        });
    });
});