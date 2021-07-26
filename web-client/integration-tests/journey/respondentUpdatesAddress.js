export const respondentUpdatesAddress = cerebralTest => {
  return it('respondent updates address', async () => {
    await cerebralTest.runSequence('gotoUserContactEditSequence');

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'contact.address1',
      value: '',
    });

    await cerebralTest.runSequence(
      'submitUpdateUserContactInformationSequence',
    );

    expect(cerebralTest.getState('validationErrors')).toEqual({
      contact: { address1: expect.anything() },
    });

    cerebralTest.updatedRespondentAddress = `UPDATED ADDRESS ${Date.now()}`;

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'contact.address1',
      value: cerebralTest.updatedRespondentAddress,
    });

    await cerebralTest.runSequence(
      'submitUpdateUserContactInformationSequence',
    );

    expect(cerebralTest.getState('validationErrors')).toEqual({});
  });
};
