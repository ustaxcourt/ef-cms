export const respondentUpdatesAddress = test => {
  return it('respondent updates address', async () => {
    await test.runSequence('gotoUserContactEditSequence');

    await test.runSequence('updateFormValueSequence', {
      key: 'contact.address1',
      value: '',
    });

    await test.runSequence('submitUpdateUserContactInformationSequence');

    expect(test.getState('validationErrors')).toEqual({
      contact: { address1: expect.anything() },
    });

    test.updatedRespondentAddress = `UPDATED ADDRESS ${Date.now()}`;

    await test.runSequence('updateFormValueSequence', {
      key: 'contact.address1',
      value: test.updatedRespondentAddress,
    });

    await test.runSequence('submitUpdateUserContactInformationSequence');

    expect(test.getState('validationErrors')).toEqual({});
  });
};
