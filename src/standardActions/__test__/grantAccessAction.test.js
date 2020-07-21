import GrantAccessAction from '../grantAccessAction';
import * as accessControl from '../../accessControl';

describe('Grant access action', () => {
    beforeEach(() => {
        accessControl.grantAccess = jest.fn();
    });

    it('should have the correct type', () => {
        expect(GrantAccessAction.type).toBe('standard');
    });

    it('should have a help message', () => {
        expect(GrantAccessAction.help).toEqual(expect.any(String));
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
                GrantAccessAction.execute(action, requester);
            });

            it('should send invalid request', () => {
                expect(requester.sendMessage).toHaveBeenCalledWith('Invalid request see help for usage');
            });
        });

        describe('when no access is provided', () => {
            beforeEach(() => {
                action.extraData = '-u someuser';
                GrantAccessAction.execute(action, requester);
            });

            it('should send invalid request', () => {
                expect(requester.sendMessage).toHaveBeenCalledWith('Invalid request see help for usage');
            });
        });

        describe('when user and access are provided', () => {
            beforeEach(() => {
                action.extraData = '-u someuser -a someaction';
                GrantAccessAction.execute(action, requester);
            });

            it('should grant the access', () => {
                expect(accessControl.grantAccess).toHaveBeenCalledWith('someuser', ['someaction']);
            });
        });
    });
});