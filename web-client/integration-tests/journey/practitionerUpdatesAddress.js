export const practitionerUpdatesAddress = test => {
  return it('practitioner updates address', async () => {
    await test.runSequence('gotoUserContactEditSequence');

    await test.runSequence('updateFormValueSequence', {
      key: 'contact.address1',
      value: '',
    });

    await test.runSequence('submitUpdateUserContactInformationSequence');

    expect(test.getState('validationErrors')).toEqual({
      contact: { address1: expect.anything() },
    });

    test.updatedPractitionerAddress = `UPDATED ADDRESS ${Date.now()}`;

    await test.runSequence('updateFormValueSequence', {
      key: 'contact.address1',
      value: test.updatedPractitionerAddress,
    });

    await test.runSequence('submitUpdateUserContactInformationSequence');

    expect(test.getState('validationErrors')).toEqual({});
  });
};
