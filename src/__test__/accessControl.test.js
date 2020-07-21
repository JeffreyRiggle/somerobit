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
    let user;

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

    describe('when user has no configured access rights', () => {
        beforeEach(() => {
            user = 'foouser';
        });

        describe('and default access rights are set', () => {
            beforeEach(() => {
                setDefaultAccess(['action1', 'action3']);
            });

            afterEach(() => {
                setDefaultAccess([]);
            });

            it('should have access to a default right', () => {
                expect(hasAccess(user, 'action1')).toBe(true);
            });

            it('should not have access to a non default right', () => {
                expect(hasAccess(user, 'action2')).toBe(false);
            });
        });

        describe('and default access rights are not set', () => {
            it('should not have access to any right', () => {
                expect(hasAccess(user, 'action1')).toBe(false);
            });
        });

        describe('and default access rights are full permissions', () => {
            beforeEach(() => {
                setDefaultAccess([fullAccess]);
            });

            afterEach(() => {
                setDefaultAccess([]);
            });

            it('should have access to a default right', () => {
                expect(hasAccess(user, 'action2')).toBe(true);
            });
        });
    });

    describe('when user has configured rights', () => {
        describe('and that user has a limited set', () => {
            beforeEach(() => {
                user = 'baruser';
                grantAccess(user, ['action1', 'action3']);
            });

            it('should have an access map', () => {
                expect(userAccess(user).length).toBe(2);
            });

            it('should grant some rights', () => {
                expect(hasAccess(user, 'action1')).toBe(true);
            })

            it('should revoke some rights', () => {
                expect(hasAccess(user, 'action2')).toBe(false);
            });

            describe('and that user is granted an extra right', () => {
                beforeEach(() => {
                    grantAccess(user, ['action2'])
                });

                it('should grant that right', () => {
                    expect(hasAccess(user, 'action2')).toBe(true);
                });
            });

            describe('and that user is revoked a right', () => {
                beforeEach(() => {
                    revokeAccess(user, ['action1'])
                });

                it('should revoke that right', () => {
                    expect(hasAccess(user, 'action1')).toBe(false);
                });
            });
        });

        describe('and that user has full access', () => {
            beforeEach(() => {
                user = 'admin';
                grantAccess(user, [fullAccess]);
            });

            it('should grant any right', () => {
                expect(hasAccess(user, 'randomaction')).toBe(true);
            });

            describe('when right is revoked from admin', () => {
                beforeEach(() => {
                    addPossibleAccess(['action1', 'action2', 'action3']);
                    revokeAccess(user, 'action1');
                });

                it('should revoke that right', () => {
                    expect(hasAccess(user, 'action1')).toBe(false);
                });

                it('should still have other rights', () => {
                    expect(hasAccess(user, 'action2')).toBe(true);
                });
            });
        });
    });
});