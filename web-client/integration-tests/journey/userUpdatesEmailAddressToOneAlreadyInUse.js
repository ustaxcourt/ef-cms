export const userUpdatesEmailAddressToOneAlreadyInUse = (test, user) =>
  it(`${user} updates email address to one that is already in use`, async () => {
    await test.runSequence('gotoChangeLoginAndServiceEmailSequence');

    await test.runSequence('updateFormValueSequence', {
      key: 'email',
      value: 'emailexists@example.com',
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'confirmEmail',
      value: 'emailexists@example.com',
    });

    await test.runSequence('submitChangeLoginAndServiceEmailSequence');

    expect(test.getState('validationErrors.email')).toBeDefined();
  });
