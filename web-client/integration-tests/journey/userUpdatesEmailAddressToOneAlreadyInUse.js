export const userUpdatesEmailAddressToOneAlreadyInUse = (cerebralTest, user) =>
  it(`${user} updates email address to one that is already in use`, async () => {
    await cerebralTest.runSequence('gotoChangeLoginAndServiceEmailSequence');

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'email',
      value: 'petitioner1@example.com',
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'confirmEmail',
      value: 'petitioner1@example.com',
    });

    await cerebralTest.runSequence('submitChangeLoginAndServiceEmailSequence');

    expect(cerebralTest.getState('validationErrors.email')).toBeDefined();
  });
