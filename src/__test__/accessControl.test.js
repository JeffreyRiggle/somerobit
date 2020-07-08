import {
    setDefaultAccess,
    grantAccess,
    revokeAccess,
    hasAccess,
    userAccess,
    setInvalidAccessMessage,
    invalidAccessMessage,
    fullAccess,
    addPossibleAccess
} from '../accessControl';

describe('Access control', () => {
    describe('when invalid access message is set', () => {
        let customMessage;

        beforeEach(() => {
            customMessage = 'Invalid Access Custom Message';
            setInvalidAccessMessage(customMessage);
        })
        it('should set the invalid access message', () => {
            expect(invalidAccessMessage()).toBe(customMessage);
        });
    });
});