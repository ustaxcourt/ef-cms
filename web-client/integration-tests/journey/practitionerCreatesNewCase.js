import { applicationContextForClient as applicationContext } from '../../../shared/src/business/test/createTestApplicationContext';
import { refreshElasticsearchIndex } from '../helpers';
import { runCompute } from 'cerebral/test';
import { startCaseHelper as startCaseHelperComputed } from '../../src/presenter/computeds/startCaseHelper';
import { withAppContextDecorator } from '../../src/withAppContext';

const startCaseHelper = withAppContextDecorator(startCaseHelperComputed);
const { CASE_TYPES_MAP, COUNTRY_TYPES } = applicationContext.getConstants();

export const practitionerCreatesNewCase = (cerebralTest, fakeFile) => {
  return it('Practitioner creates a new case', async () => {
    await cerebralTest.runSequence('gotoStartCaseWizardSequence');
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

    let result = runCompute(startCaseHelper, {
      state: cerebralTest.getState(),
    });
    expect(result.showPrimaryContact).toBeFalsy();
    expect(result.showSecondaryContact).toBeFalsy();

    // Petitioner party type primary contact with international address
    await cerebralTest.runSequence('updateStartCaseFormValueSequence', {
      key: 'filingType',
      value: 'Petitioner and spouse',
    });

    await cerebralTest.runSequence('updateStartCaseFormValueSequence', {
      key: 'isSpouseDeceased',
      value: 'No',
    });

    result = runCompute(startCaseHelper, {
      state: cerebralTest.getState(),
    });
    expect(result.showPrimaryContact).toBeTruthy();
    expect(result.showSecondaryContact).toBeTruthy();

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.countryType',
      value: COUNTRY_TYPES.INTERNATIONAL,
    });
    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.country',
      value: 'Switzerland',
    });
    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.name',
      value: 'Daenerys Stormborn',
    });
    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.address1',
      value: '123 Abc Ln',
    });
    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.city',
      value: 'Cityville',
    });
    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.postalCode',
      value: '23-skidoo',
    });
    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.phone',
      value: '1234567890',
    });

    expect(cerebralTest.getState('form.contactPrimary')).toEqual({
      address1: '123 Abc Ln',
      city: 'Cityville',
      country: 'Switzerland',
      countryType: COUNTRY_TYPES.INTERNATIONAL,
      name: 'Daenerys Stormborn',
      phone: '1234567890',
      postalCode: '23-skidoo',
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'contactSecondary.countryType',
      value: COUNTRY_TYPES.INTERNATIONAL,
    });
    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'contactSecondary.country',
      value: 'Switzerland',
    });
    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'contactSecondary.name',
      value: 'Test Spouse',
    });
    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'contactSecondary.address1',
      value: '123 Abc Ln',
    });
    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'contactSecondary.city',
      value: 'Cityville',
    });
    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'contactSecondary.postalCode',
      value: '23-skidoo',
    });
    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'contactSecondary.phone',
      value: '1234567890',
    });

    expect(cerebralTest.getState('form.contactSecondary')).toEqual({
      address1: '123 Abc Ln',
      city: 'Cityville',
      country: 'Switzerland',
      countryType: COUNTRY_TYPES.INTERNATIONAL,
      name: 'Test Spouse',
      phone: '1234567890',
      postalCode: '23-skidoo',
    });

    await cerebralTest.runSequence('updateStartCaseFormValueSequence', {
      key: 'hasIrsNotice',
      value: false,
    });

    result = runCompute(startCaseHelper, {
      state: cerebralTest.getState(),
    });
    expect(result.showHasIrsNoticeOptions).toBeFalsy();
    expect(result.showNotHasIrsNoticeOptions).toBeTruthy();

    await cerebralTest.runSequence('updateStartCaseFormValueSequence', {
      key: 'hasIrsNotice',
      value: true,
    });

    result = runCompute(startCaseHelper, {
      state: cerebralTest.getState(),
    });
    expect(result.showHasIrsNoticeOptions).toBeTruthy();
    expect(result.showNotHasIrsNoticeOptions).toBeFalsy();

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'caseType',
      value: CASE_TYPES_MAP.whistleblower,
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'month',
      value: '01',
    });
    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'day',
      value: '01',
    });
    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'year',
      value: '2001',
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'procedureType',
      value: 'Small',
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'preferredTrialCity',
      value: 'Seattle, Washington',
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'caseType',
      value: CASE_TYPES_MAP.whistleblower,
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'wizardStep',
      value: '5',
    });

    await cerebralTest.runSequence('submitFilePetitionSequence');

    expect(cerebralTest.getState('alertError')).toBeUndefined();

    expect(cerebralTest.getState('currentPage')).toBe('FilePetitionSuccess');

    await refreshElasticsearchIndex();

    await cerebralTest.runSequence('gotoDashboardSequence');

    expect(cerebralTest.getState('currentPage')).toBe('DashboardPractitioner');

    cerebralTest.docketNumber = cerebralTest.getState(
      'openCases.0.docketNumber',
    );
  });
};
