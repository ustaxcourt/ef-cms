import { applicationContextForClient as applicationContext } from '../../../shared/src/business/test/createTestApplicationContext';

const { COUNTRY_TYPES } = applicationContext.getConstants();

export const petitionerCreatesNewCase = (test, fakeFile, overrides = {}) => {
  return it('petitioner creates a new case', async () => {
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
      value:
        'Daenerys Stormborn of the House Targaryen, First of Her Name, the Unburnt, Queen of the Andals and the First Men, Khaleesi of the Great Grass Sea, Breaker of Chains, and Mother of Dragons',
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.secondaryName',
      value:
        'Daenerys Stormborn of the House Targaryen, First of Her Name, the Unburnt, Queen of the Andals and the First Men, Khaleesi of the Great Grass Sea, Breaker of Chains, and Mother of Dragons 2',
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
      countryType: COUNTRY_TYPES.DOMESTIC,
      email: 'test@example.com',
      name:
        'Daenerys Stormborn of the House Targaryen, First of Her Name, the Unburnt, Queen of the Andals and the First Men, Khaleesi of the Great Grass Sea, Breaker of Chains, and Mother of Dragons',
      phone: '1234567890',
      postalCode: '12345',
      secondaryName:
        'Daenerys Stormborn of the House Targaryen, First of Her Name, the Unburnt, Queen of the Andals and the First Men, Khaleesi of the Great Grass Sea, Breaker of Chains, and Mother of Dragons 2',
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
      value: '5',
    });
    await test.runSequence('submitFilePetitionSequence');

    expect(test.getState('validationErrors')).toEqual({});
    expect(test.getState('alertError')).toBeUndefined();

    expect(test.getState('currentPage')).toBe('FilePetitionSuccess');

    await test.runSequence('gotoDashboardSequence');

    expect(test.getState('currentPage')).toBe('DashboardPetitioner');

    test.docketNumber = test.getState('openCases.0.docketNumber');
  });
};
