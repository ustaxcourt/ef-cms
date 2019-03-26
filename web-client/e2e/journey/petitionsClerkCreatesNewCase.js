export default (test, fakeFile) => {
  return it('Petitions clerk creates a new case', async () => {
    await test.runSequence('gotoStartCaseSequence');
    await test.runSequence('submitPetitionFromPaperSequence');

    expect(test.getState('alertError.title')).toEqual(
      'Please correct the following errors on the page:',
    );

    expect(test.getState('validationErrors.caseCaption')).toEqual(
      'Case Caption is required.',
    );

    expect(test.getState('validationErrors.createdAt')).toEqual(
      'Please enter a valid date.',
    );

    expect(test.getState('validationErrors.petitionFile')).toEqual(
      'The Petition file was not selected.',
    );

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

    await test.runSequence('updateFormValueSequence', {
      key: 'caseCaption',
      value: 'Test Person, Deceased, Test Person, Surviving Spouse, Petitioner',
    });

    await test.runSequence('updatePetitionValueSequence', {
      key: 'petitionFile',
      value: fakeFile,
    });

    await test.runSequence('updatePetitionValueSequence', {
      key: 'stinFile',
      value: fakeFile,
    });

    await test.runSequence('validatePetitionFromPaperSequence');
    expect(test.getState('alertError')).toEqual(null);
    expect(test.getState('validationErrors')).toEqual({});

    // await test.runSequence('submitPetitionFromPaperSequence');

    // expect(test.getState('alertError')).toEqual(null);

    // expect(test.getState('alertSuccess')).toEqual({
    //   message: 'You can access your case at any time from the case list below.',
    //   title: 'Your petition has been successfully submitted.',
    // });
  });
};
