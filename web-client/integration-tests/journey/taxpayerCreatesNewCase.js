export default (test, fakeFile, overrides = {}) => {
  return it('Taxpayer creates a new case', async () => {
    await test.runSequence('gotoStartCaseWizardSequence');

    await test.runSequence('updateStartCaseFormValueSequence', {
      key: 'petitionFile',
      value: fakeFile,
    });

    await test.runSequence('updateStartCaseFormValueSequence', {
      key: 'petitionFileSize',
      value: 1,
    });

    await test.runSequence('updateStartCaseFormValueSequence', {
      key: 'stinFile',
      value: fakeFile,
    });

    await test.runSequence('updateStartCaseFormValueSequence', {
      key: 'stinFileSize',
      value: 1,
    });

    await test.runSequence('updateStartCaseFormValueSequence', {
      key: 'filingType',
      value: 'Other',
    });

    await test.runSequence('updateStartCaseFormValueSequence', {
      key: 'otherType',
      value: 'Deceased Spouse',
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.name',
      value: 'Test Person',
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.secondaryName',
      value: 'Test Person 2',
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.address1',
      value: '123 Abc Ln',
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.address2',
      value: 'Apt 2',
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.city',
      value: 'Cityville',
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.state',
      value: 'CA',
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.postalCode',
      value: '12345',
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.email',
      value: 'test@example.com',
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.phone',
      value: '1234567890',
    });
    expect(test.getState('form.contactPrimary')).toEqual({
      address1: '123 Abc Ln',
      address2: 'Apt 2',
      city: 'Cityville',
      countryType: 'domestic',
      email: 'test@example.com',
      name: 'Test Person',
      phone: '1234567890',
      postalCode: '12345',
      secondaryName: 'Test Person 2',
      state: 'CA',
    });

    await test.runSequence('updateStartCaseFormValueSequence', {
      key: 'hasIrsNotice',
      value: true,
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'caseType',
      value: overrides.caseType || 'Whistleblower',
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'preferredTrialCity',
      value: 'Seattle, Washington',
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'procedureType',
      value: 'Regular',
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'wizardStep',
      value: '4',
    });

    await test.runSequence('submitFilePetitionSequence');
    expect(test.getState('validationErrors')).toEqual({});

    expect(test.getState('validationErrors')).toEqual({});
    expect(test.getState('alertError')).toBeUndefined();

    expect(test.getState('alertSuccess')).toEqual({
      message: 'You can access your case at any time from the case list below.',
      title: 'Your petition has been successfully submitted.',
    });

    test.docketNumber = test.getState('cases.0.docketNumber');
  });
};
