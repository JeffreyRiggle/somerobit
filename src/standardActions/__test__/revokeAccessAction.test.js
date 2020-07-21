import RevokeAccessAction from '../revokeAccessAction';
import * as accessControl from '../../accessControl';

describe('Revoke access action', () => {
    beforeEach(() => {
        accessControl.revokeAccess = jest.fn();
    });

    it('should have the correct type', () => {
        expect(RevokeAccessAction.type).toBe('standard');
    });

    it('should have a help message', () => {
        expect(RevokeAccessAction.help).toEqual(expect.any(String));
    });

    describe('when execute is called', () => {
        let requester, action;

        beforeEach(() => {
            requester = {
                sendMessage: jest.fn(() => Promise.resolve())
            };
            action = { };
        });

        describe('when no user is provided', () => {
            beforeEach(() => {
                action.extraData = '-a somecontrol';
                RevokeAccessAction.execute(action, requester);
            });

            it('should send invalid request', () => {
                expect(requester.sendMessage).toHaveBeenCalledWith('Invalid request see help for usage');
            });
        });

        describe('when no access is provided', () => {
            beforeEach(() => {
                action.extraData = '-u someuser';
                RevokeAccessAction.execute(action, requester);
            });

            it('should send invalid request', () => {
                expect(requester.sendMessage).toHaveBeenCalledWith('Invalid request see help for usage');
            });
        });

        describe('when user and access are provided', () => {
            beforeEach(() => {
                action.extraData = '-u someuser -a someaction';
                RevokeAccessAction.execute(action, requester);
            });

            it('should grant the access', () => {
                expect(accessControl.revokeAccess).toHaveBeenCalledWith('someuser', ['someaction']);
            });
        });
    });
});