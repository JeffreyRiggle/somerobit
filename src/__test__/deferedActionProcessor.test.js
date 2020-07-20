import moment from 'moment';
import { processActions } from '../deferedActionProcessor';
import * as actionProcessor from '../actionProcessor';

describe('defered action processor', () => {
    let action, actions;

    beforeEach(() => {
        action = {
            action: {}
        };

        actions = [action];
        actionProcessor.process = jest.fn();
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.clearAllTimers();
    });

    describe('when action has a timestamp', () => {
        describe('and action is not valid', () => {
            beforeEach(() => {
                action.timestamp = 'invalid';
                processActions(actions);
                jest.runAllTimers();
            });

            it('should not execute the action', () => {
                expect(actionProcessor.process).not.toHaveBeenCalled();
            });
        });

        describe('and action is in the past', () => {
            beforeEach(() => {
                action.timestamp = moment().subtract(1, 'days');
                processActions(actions);
                jest.runAllTimers();
            });

            it('should not execute the action', () => {
                expect(actionProcessor.process).not.toHaveBeenCalled();
            });
        });

        describe('and action is in the future', () => {
            beforeEach(() => {
                action.timestamp = moment().add(1, 'days');
                processActions(actions);
                jest.runAllTimers();
            });

            it('should execute the action', () => {
                expect(actionProcessor.process).toHaveBeenCalledWith(action.action);
            });

            describe('and action is reoccuring', () => {
                beforeEach(() => {
                    action.reoccuring = true;
                    processActions(actions);
                    jest.runOnlyPendingTimers();
                    jest.runOnlyPendingTimers();
                });

                it('should execute the action again', () => {
                    expect(actionProcessor.process).toHaveBeenCalledTimes(3);
                });
            });
        });
    });

    describe('when action is daily', () => {
        describe('and the time is in the past', () => {
            beforeEach(() => {
                action.daily = moment().subtract(1, 'minutes');
                processActions(actions);
                jest.runOnlyPendingTimers();
            });

            it('should execute the action next day', () => {
                expect(actionProcessor.process).toHaveBeenCalledTimes(1);
            });
        });

        describe('and the time is upcoming', () => {
            beforeEach(() => {
                action.daily = moment().add(1, 'minutes');
                processActions(actions);
                jest.runOnlyPendingTimers();
            });

            it('should execute the action', () => {
                expect(actionProcessor.process).toHaveBeenCalledTimes(1);
            });

            describe('and another day passes', () => {
                beforeEach(() => {
                    jest.runOnlyPendingTimers();
                });

                it('should execute the action', () => {
                    expect(actionProcessor.process).toHaveBeenCalledTimes(2);
                });
            });
        });
    });

    describe('and the action is reocurring', () => {
        beforeEach(() => {
            action.reoccuring = true;
            action.dely = 5;
            processActions(actions);
            jest.runOnlyPendingTimers();
        });

        it('should execute the action', () => {
            expect(actionProcessor.process).toHaveBeenCalledTimes(1);
        });
    });

    describe('and the action is a single delay', () => {
        beforeEach(() => {
            action.dely = 5;
            processActions(actions);
            jest.runAllTimers();
        });

        it('should execute the action', () => {
            expect(actionProcessor.process).toHaveBeenCalledTimes(1);
        });
    });
});