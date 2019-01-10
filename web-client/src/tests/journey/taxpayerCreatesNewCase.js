export default (test, fakeFile) => {
  return it('Taxpayer creates a new case', async () => {
    await test.runSequence('gotoFilePetitionSequence');
    await test.runSequence('updatePetitionValueSequence', {
      key: 'petitionFile',
      value: fakeFile,
    });
    await test.runSequence('updatePetitionValueSequence', {
      key: 'caseType',
      value: 'noticeOfDeficiency',
    });
    await test.runSequence('updatePetitionValueSequence', {
      key: 'irsNoticeDate',
      value: '01/01/1990',
    });
    await test.runSequence('updatePetitionValueSequence', {
      key: 'procedureType',
      value: 'small',
    });
    await test.runSequence('updatePetitionValueSequence', {
      key: 'preferredTrialCity',
      value: 'Chattanooga, TN',
    });
    await test.runSequence('submitFilePetitionSequence');
    expect(test.getState('alertSuccess')).toEqual({
      title: 'Your files were uploaded successfully.',
      message: 'Your case has now been created.',
    });
  });
};
