export const userUpdatesEmailAddressToOneAlreadyInUse = (
  cerebralTest,
  user,
  email = 'petitioner1@example.com',
) =>
  it(`${user} updates email address to one that is already in use`, async () => {
    await cerebralTest.runSequence('gotoChangeLoginAndServiceEmailSequence');

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'email',
      value: email,
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'confirmEmail',
      value: email,
    });

    await cerebralTest.runSequence('submitChangeLoginAndServiceEmailSequence');

    expect(cerebralTest.getState('validationErrors.email')).toBeDefined();
  });
