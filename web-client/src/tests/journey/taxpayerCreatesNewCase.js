export default (test, fakeFile) => {
  return it('Taxpayer creates a new case', async () => {
    await test.runSequence('updatePetitionValueSequence', {
      key: 'petitionFile',
      value: fakeFile,
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'irsNoticeDate',
      value: '01/01/2000',
    });
    await test.runSequence('submitFilePetitionSequence');
    expect(test.getState('alertSuccess')).toEqual({
      title: 'Your files were uploaded successfully.',
      message: 'Your case has now been created.',
    });
  });
};
