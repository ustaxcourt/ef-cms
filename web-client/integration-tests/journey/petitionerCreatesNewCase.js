import { applicationContextForClient as applicationContext } from '../../../shared/src/business/test/createTestApplicationContext';

const { CASE_TYPES_MAP, COUNTRY_TYPES } = applicationContext.getConstants();

export const petitionerCreatesNewCase = (
  cerebralTest,
  fakeFile,
  overrides = {},
) => {
  return it('petitioner creates a new case', async () => {
    await cerebralTest.runSequence('gotoStartCaseWizardSequence');

    expect(cerebralTest.getState('currentPage')).toBe('StartCaseWizard');

    await cerebralTest.runSequence('updateStartCaseFormValueSequence', {
      key: 'petitionFile',
      value: fakeFile,
    });

    await cerebralTest.runSequence('updateStartCaseFormValueSequence', {
      key: 'petitionFileSize',
      value: 1,
    });

    await cerebralTest.runSequence('updateStartCaseFormValueSequence', {
      key: 'stinFile',
      value: fakeFile,
    });

    await cerebralTest.runSequence('updateStartCaseFormValueSequence', {
      key: 'stinFileSize',
      value: 1,
    });

    await cerebralTest.runSequence('updateStartCaseFormValueSequence', {
      key: 'filingType',
      value: CASE_TYPES_MAP.other,
    });

    await cerebralTest.runSequence('updateStartCaseFormValueSequence', {
      key: 'otherType',
      value: 'Deceased Spouse',
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.name',
      value: 'Daenerys Stormborn',
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.secondaryName',
      value: 'Daenerys Stormborn 2',
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.address1',
      value: '123 Abc Ln',
    });
    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.address2',
      value: 'Apt 2',
    });
    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.city',
      value: 'Cityville',
    });
    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.state',
      value: 'CA',
    });
    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.postalCode',
      value: '12345',
    });
    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.email',
      value: 'test@example.com',
    });
    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.phone',
      value: '1234567890',
    });

    expect(cerebralTest.getState('form.contactPrimary')).toEqual({
      address1: '123 Abc Ln',
      address2: 'Apt 2',
      city: 'Cityville',
      countryType: COUNTRY_TYPES.DOMESTIC,
      email: 'test@example.com',
      name: 'Daenerys Stormborn',
      phone: '1234567890',
      postalCode: '12345',
      secondaryName: 'Daenerys Stormborn 2',
      state: 'CA',
    });

    await cerebralTest.runSequence('updateStartCaseFormValueSequence', {
      key: 'hasIrsNotice',
      value: true,
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'caseType',
      value: overrides.caseType || CASE_TYPES_MAP.whistleblower,
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'preferredTrialCity',
      value: 'Seattle, Washington',
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'procedureType',
      value: 'Regular',
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'wizardStep',
      value: '5',
    });

    await cerebralTest.runSequence('validateStartCaseWizardSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({});
    expect(cerebralTest.getState('alertError')).toBeUndefined();

    await cerebralTest.runSequence('submitFilePetitionSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({});
    expect(cerebralTest.getState('alertError')).toBeUndefined();

    expect(cerebralTest.getState('currentPage')).toBe('FilePetitionSuccess');

    await cerebralTest.runSequence('gotoDashboardSequence');

    expect(cerebralTest.getState('currentPage')).toBe('DashboardPetitioner');

    cerebralTest.docketNumber = cerebralTest.getState(
      'openCases.0.docketNumber',
    );
  });
};
