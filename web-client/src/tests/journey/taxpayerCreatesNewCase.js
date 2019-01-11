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
      value: '01',
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'year',
      value: '2001',
    });
    // try without checking the signature
    await test.runSequence('submitFilePetitionSequence');
    expect(test.getState('alertError')).toEqual({
      title: 'Errors were found. Please correct your form and resubmit.',
    });

    // click the signature and try again
    await test.runSequence('updateFormValueSequence', {
      key: 'signature',
      value: true,
    });
    await test.runSequence('submitFilePetitionSequence');
    expect(test.getState('alertSuccess')).toEqual({
      title: 'Your files were uploaded successfully.',
      message: 'Your case has now been created.',
    });
  });
};
