export default test => {
  return it('respondent updates address', async () => {
    await test.runSequence('gotoUserContactEditSequence');

    console.log('a');
    await test.runSequence('updateFormValueSequence', {
      key: 'contact.address1',
      value: '',
    });
    console.log('b');

    await test.runSequence('submitUpdateUserContactInformationSequence');
    console.log('c');

    expect(test.getState('validationErrors')).toEqual({
      contact: { address1: expect.anything() },
    });

    test.updatedRespondentAddress = `UPDATED ADDRESS ${Date.now()}`;

    await test.runSequence('updateFormValueSequence', {
      key: 'contact.address1',
      value: test.updatedRespondentAddress,
    });

    console.log('c1');
    await test.runSequence('submitUpdateUserContactInformationSequence');
    console.log('d');

    expect(test.getState('validationErrors')).toEqual({});
  });
};
