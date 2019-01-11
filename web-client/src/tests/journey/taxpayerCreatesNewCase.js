export default (test, fakeFile) => {
  return it('Taxpayer creates a new case', async () => {
    await test.runSequence('updatePetitionValueSequence', {
      key: 'petitionFile',
      value: fakeFile,
    });

    await test.runSequence('updatePetitionValueSequence', {
      key: 'irsNoticeFile',
      value: fakeFile,
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'month',
      value: '01',
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'day',
      value: '00',
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'year',
      value: '2001',
    });

    await test.runSequence('submitFilePetitionSequence');

    expect(test.getState('alertError.messages.0')).toEqual(
      'IRS Notice Date is a required field.',
    );

    await test.runSequence('updateFormValueSequence', {
      key: 'day',
      value: '01',
    });
    await test.runSequence('submitFilePetitionSequence');

    expect(test.getState('alertError')).toEqual(null);

    expect(test.getState('alertSuccess')).toEqual({
      title: 'Your petition has been successfully submitted.',
      message: 'You can access your case at any time from the case list below.',
    });
  });
};
