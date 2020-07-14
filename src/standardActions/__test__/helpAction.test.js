import HelpAction from '../helpAction';
import * as actionRepository from '../../actionRepository';
import * as messagebroadcaster from '../../messagebroadcaster';

describe('Help action', () => {
    let requester, action, actions, currentAction;

    beforeEach(() => {
        actions = [];
        currentAction = {};

        actionRepository.getAction = jest.fn(() => currentAction);
        actionRepository.getActions = jest.fn(() => actions);
        messagebroadcaster.broadcastToChannel = jest.fn();
        requester = {
            sendMessage: jest.fn(() => Promise.resolve())
        };
    });

    it('should have the correct type', () => {
        expect(HelpAction.type).toBe('standard');
    });

    it('should have the correct help message', () => {
        expect(HelpAction.help).toEqual(expect.any(String));
    });

    describe('when execute is called', () => {
        describe('and no action is provided', () => {
            beforeEach(() => {
                action = { };
                HelpAction.execute(action, requester);
            });

            it('should list all commands', () => {
                expect(requester.sendMessage).toHaveBeenCalledWith(HelpAction.help);
            });
        });

        describe('and action is provided', () => {
            beforeEach(() => {
                currentAction = {
                    id: 'foobar',
                    help: 'This is a foobar command'
                };

                action = {
                    extraData: currentAction.id
                };
                HelpAction.execute(action, requester);
            });

            it('should provide command help', () => {
                expect(requester.sendMessage).toHaveBeenCalledWith(currentAction.help);
            });
        });

        describe('and action is provided that does not have help', () => {
            beforeEach(() => {
                currentAction = {
                    id: 'foobar'
                };

                action = {
                    extraData: currentAction.id
                };
                HelpAction.execute(action, requester);
            });

            it('should provide command help', () => {
                expect(requester.sendMessage).toHaveBeenCalledWith(`No help available for ${action.extraData}`);
            });
        });
    });
});