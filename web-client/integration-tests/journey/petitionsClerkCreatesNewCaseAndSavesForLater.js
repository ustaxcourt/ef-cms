export default (test, fakeFile, trialLocation = 'Birmingham, Alabama') => {
  return it('Petitions clerk creates a new case and saves for later', async () => {
    await test.runSequence('gotoStartCaseWizardSequence');
    await test.runSequence('navigateToReviewPetitionFromPaperSequence');

    const formValues = [
      {
        key: 'dateReceivedMonth',
        value: '01',
      },
      {
        key: 'dateReceivedDay',
        value: '01',
      },
      {
        key: 'dateReceivedYear',
        value: '2001',
      },
      {
        key: 'mailingDate',
        value: 'Some Day',
      },
      {
        key: 'caseCaption',
        value:
          'Test Person, Deceased, Test Person, Surviving Spouse, Petitioner',
      },
      {
        key: 'petitionFile',
        value: fakeFile,
      },
      {
        key: 'petitionFileSize',
        value: 1,
      },
      {
        key: 'stinFile',
        value: fakeFile,
      },
      {
        key: 'stinFileSize',
        value: 1,
      },
      {
        key: 'ownershipDisclosureFile',
        value: fakeFile,
      },
      {
        key: 'ownershipDisclosureFileSize',
        value: 1,
      },
      {
        key: 'requestForPlaceOfTrialFile',
        value: fakeFile,
      },
      {
        key: 'requestForPlaceOfTrialFileSize',
        value: 1,
      },
      {
        key: 'applicationForWaiverOfFilingFeeFile',
        value: fakeFile,
      },
      {
        key: 'applicationForWaiverOfFilingFeeFileSize',
        value: 1,
      },
      {
        key: 'preferredTrialCity',
        value: trialLocation,
      },
      {
        key: 'procedureType',
        value: 'Small',
      },
      {
        key: 'caseType',
        value: 'Deficiency',
      },
      {
        key: 'partyType',
        value: 'Petitioner',
      },
      {
        key: 'contactPrimary.countryType',
        value: 'international',
      },
      {
        key: 'contactPrimary.country',
        value: 'Switzerland',
      },
      {
        key: 'contactPrimary.name',
        value: 'Test Person',
      },
      {
        key: 'contactPrimary.address1',
        value: '123 Abc Ln',
      },
      {
        key: 'contactPrimary.city',
        value: 'Cityville',
      },
      {
        key: 'contactPrimary.postalCode',
        value: '23-skidoo',
      },
      {
        key: 'contactPrimary.email',
        value: 'test@example.com',
      },
      {
        key: 'contactPrimary.phone',
        value: '1234567890',
      },
    ];

    formValues.forEach(async item => {
      await test.runSequence('updateFormValueSequence', item);
    });

    await test.runSequence('validatePetitionFromPaperSequence');

    expect(test.getState('alertError')).toBeUndefined();
    expect(test.getState('validationErrors')).toEqual({});

    await test.runSequence('navigateToReviewPetitionFromPaperSequence');
    await test.runSequence('gotoReviewPetitionFromPaperSequence');

    expect(test.getState('currentPage')).toEqual('ReviewPetitionFromPaper');

    await test.runSequence('saveInternalCaseForLaterSequence');

    expect(test.getState('currentPage')).toEqual('Messages');
  });
};
