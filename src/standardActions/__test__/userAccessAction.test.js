import UserAccessAction from '../userAccessAction';
import * as accessControl from '../../accessControl';

describe('user access action', () => {
    let mockHasAccess, mockUserAccess;

    beforeEach(() => {
        accessControl.hasAccess = jest.fn(() => mockHasAccess);
        accessControl.userAccess = jest.fn(() => mockUserAccess);
    });

    it('should have the correct type', () => {
        expect(UserAccessAction.type).toBe('standard');
    });

    it('should have a help message', () => {
        expect(UserAccessAction.help).toEqual(expect.any(String));
    });

    describe('when execute is called', () => {
        let requester, action;

        beforeEach(() => {
            requester = {
                username: 'foobar',
                sendMessage: jest.fn(() => Promise.resolve())
            };
            action = { };
        });

        describe('and no user is provided', () => {
            beforeEach(() => {
                mockUserAccess = ['action1', 'action2'];
                UserAccessAction.execute(action, requester);
            });

            it('should send the current users access', () => {
                expect(requester.sendMessage).toHaveBeenCalledWith(`${requester.username} has access to ${mockUserAccess.join(', ')}`);
            });
        });

        describe('and user is provided', () => {
            beforeEach(() => {
                action.extraData = 'someuser'
            });

            describe('but requesting user does not have permission', () => {
                beforeEach(() => {
                    mockHasAccess = false;
                    UserAccessAction.execute(action, requester);
                });

                it('should send an invalid permission message', () => {
                    expect(requester.sendMessage).toHaveBeenCalledWith(`You do not have access to view access of user ${action.extraData}`);
                });
            });

            describe('and the requested user has no permissions', () => {
                beforeEach(() => {
                    mockHasAccess = true;
                    mockUserAccess = undefined;
                    UserAccessAction.execute(action, requester);
                });

                it('should send a nothing message', () => {
                    expect(requester.sendMessage).toHaveBeenCalledWith(`${action.extraData} has access to Nothing`);
                });
            });
        });
    });
});