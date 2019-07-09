export default (test, fakeFile, overrides = {}) => {
  return it('Taxpayer creates a new case', async () => {
    await test.runSequence('updatePetitionValueSequence', {
      key: 'petitionFile',
      value: fakeFile,
    });

    await test.runSequence('updatePetitionValueSequence', {
      key: 'petitionFileSize',
      value: 1,
    });

    await test.runSequence('updatePetitionValueSequence', {
      key: 'stinFile',
      value: fakeFile,
    });

    await test.runSequence('updatePetitionValueSequence', {
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
      key: 'contactSecondary.name',
      value: 'Test Person',
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'contactSecondary.address1',
      value: '123 Abc Ln',
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'contactSecondary.address2',
      value: 'Apt 2',
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'contactSecondary.city',
      value: 'Cityville',
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'contactSecondary.state',
      value: 'CA',
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'contactSecondary.postalCode',
      value: '12345',
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'contactSecondary.email',
      value: 'test@example.com',
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'contactSecondary.phone',
      value: '1234567890',
    });

    expect(test.getState('form.contactSecondary')).toEqual({
      address1: '123 Abc Ln',
      address2: 'Apt 2',
      city: 'Cityville',
      countryType: 'domestic',
      email: 'test@example.com',
      name: 'Test Person',
      phone: '1234567890',
      postalCode: '12345',
      state: 'CA',
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.name',
      value: 'Test Person',
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
      state: 'CA',
    });

    await test.runSequence('updateHasIrsNoticeFormValueSequence', {
      key: 'hasIrsNotice',
      value: true,
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'caseType',
      value: overrides.caseType || 'Whistleblower',
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

    await test.runSequence('updateFormValueSequence', {
      key: 'signature',
      value: true,
    });

    await test.runSequence('submitFilePetitionSequence');

    expect(test.getState('alertError')).toEqual(null);

    expect(test.getState('alertSuccess')).toEqual({
      message: 'You can access your case at any time from the case list below.',
      title: 'Your petition has been successfully submitted.',
    });
  });
};
