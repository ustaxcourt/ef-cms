import { runCompute } from 'cerebral/test';
import { startCaseHelper } from '../../src/presenter/computeds/startCaseHelper';

export default (test, fakeFile) => {
  return it('Practitioner creates a new case', async () => {
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

    let result = runCompute(startCaseHelper, {
      state: test.getState(),
    });
    expect(result.showPrimaryContact).toBeFalsy();
    expect(result.showSecondaryContact).toBeFalsy();

    // Petitioner party type primary contact with international address
    await test.runSequence('updateStartCaseFormValueSequence', {
      key: 'filingType',
      value: 'Individual petitioner',
    });

    result = runCompute(startCaseHelper, {
      state: test.getState(),
    });
    expect(result.showPrimaryContact).toBeTruthy();

    await test.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.countryType',
      value: 'international',
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.country',
      value: 'Switzerland',
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
      key: 'contactPrimary.city',
      value: 'Cityville',
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.postalCode',
      value: '23-skidoo',
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
      city: 'Cityville',
      country: 'Switzerland',
      countryType: 'international',
      email: 'test@example.com',
      name: 'Test Person',
      phone: '1234567890',
      postalCode: '23-skidoo',
    });

    await test.runSequence('updateHasIrsNoticeFormValueSequence', {
      key: 'hasIrsNotice',
      value: false,
    });

    result = runCompute(startCaseHelper, {
      state: test.getState(),
    });
    expect(result.showHasIrsNoticeOptions).toBeFalsy();
    expect(result.showNotHasIrsNoticeOptions).toBeTruthy();

    await test.runSequence('updateHasIrsNoticeFormValueSequence', {
      key: 'hasIrsNotice',
      value: true,
    });

    result = runCompute(startCaseHelper, {
      state: test.getState(),
    });
    expect(result.showHasIrsNoticeOptions).toBeTruthy();
    expect(result.showNotHasIrsNoticeOptions).toBeFalsy();

    await test.runSequence('updateFormValueSequence', {
      key: 'caseType',
      value: 'Whistleblower',
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
      key: 'procedureType',
      value: 'Small',
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'preferredTrialCity',
      value: 'Seattle, Washington',
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'caseType',
      value: 'Whistleblower',
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

    test.docketNumber = test.getState('cases.0.docketNumber');
  });
};
