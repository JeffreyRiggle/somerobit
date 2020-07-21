import {
    addAction,
    removeAction,
    clearActions,
    getAction,
    getActions
} from '../actionRepository';

describe('Action Repository', () => {
    let action1, action1Id, action2, action2Id;
    beforeEach(() => {
        action1 = {
            type: 'standard',
            help: 'some help',
            execute: () => { }
        };

        action1Id = 'action1';

        action2 = {
            type: 'standard',
            help: 'some other help',
            execute: () => { }
        };

        action2Id = 'action2';
    });

    describe('when action is added', () => {
        beforeEach(() => {
            addAction(action1Id, action1);
        });

        it('should have that action', () => {
            expect(getAction(action1Id)).toBe(action1);
        });

        it('should have the correct actions', () => {
            expect(getActions().size).toBe(1);
        });

        describe('when another action is added', () => {
            beforeEach(() => {
                addAction(action2Id, action2);
            });

            it('should have that action', () => {
                expect(getAction(action2Id)).toBe(action2);
            });
    
            it('should have the correct actions', () => {
                expect(getActions().size).toBe(2);
            });

            describe('when actions are cleared', () => {
                beforeEach(() => {
                    clearActions();
                });

                it('should remove first action', () => {
                    expect(getAction(action1Id)).toBe(undefined);
                });

                it('should remove second action', () => {
                    expect(getAction(action2Id)).toBe(undefined);
                });

                it('should have the correct actions', () => {
                    expect(getActions().size).toBe(0);
                });
            });

            describe('when action is removed', () => {
                beforeEach(() => {
                    removeAction(action1Id);
                });

                it('should remove that action', () => {
                    expect(getAction(action1Id)).toBe(undefined);
                });

                it('should keep other actions', () => {
                    expect(getActions().size).toBe(1);
                });
            });
        });
    });
});