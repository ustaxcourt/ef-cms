import { runCompute } from 'cerebral/test';

import startCaseHelper from '../../src/presenter/computeds/startCaseHelper';

export default (test, fakeFile) => {
  return it('Taxpayer creates a new case', async () => {
    await test.runSequence('updatePetitionValueSequence', {
      key: 'petitionFile',
      value: fakeFile,
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'month',
      value: '01',
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'day',
      value: '00',
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'year',
      value: '2001',
    });

    let result = runCompute(startCaseHelper, {
      state: test.getState(),
    });
    expect(result.showPetitionerContact).toBeFalsy();

    await test.runSequence('updateFormValueSequence', {
      key: 'partyType',
      value: 'Petitioner',
    });

    result = runCompute(startCaseHelper, {
      state: test.getState(),
    });
    expect(result.showPetitionerContact).toBeTruthy();

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
      key: 'contactPrimary.zip',
      value: '12345',
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.email',
      value: 'test@test.com',
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.phone',
      value: '1234567890',
    });

    expect(test.getState('form.contactPrimary')).toEqual({
      name: 'Test Person',
      address1: '123 Abc Ln',
      address2: 'Apt 2',
      city: 'Cityville',
      state: 'CA',
      zip: '12345',
      email: 'test@test.com',
      phone: '1234567890',
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'partyType',
      value: 'Petitioner & Spouse',
    });

    result = runCompute(startCaseHelper, {
      state: test.getState(),
    });
    expect(result.showPetitionerAndSpouseContact).toBeTruthy();

    await test.runSequence('updateFormValueSequence', {
      key: 'partyType',
      value: 'Estate without Executor/Personal Representative/Etc.',
    });

    result = runCompute(startCaseHelper, {
      state: test.getState(),
    });
    expect(result.showEstateWithoutExecutorContact).toBeTruthy();

    // try without checking the signature
    await test.runSequence('submitFilePetitionSequence');
    expect(test.getState('alertError')).toEqual({
      title: 'Errors were found. Please correct your form and resubmit.',
    });

    // click the signature and try again
    await test.runSequence('updateFormValueSequence', {
      key: 'signature',
      value: true,
    });

    await test.runSequence('submitFilePetitionSequence');

    expect(test.getState('alertError.title')).toEqual(
      'Errors were found. Please correct your form and resubmit.',
    );

    await test.runSequence('updateFormValueSequence', {
      key: 'day',
      value: '01',
    });

    await test.runSequence('submitFilePetitionSequence');

    expect(test.getState('alertError')).toEqual(null);

    expect(test.getState('alertSuccess')).toEqual({
      title: 'Your petition has been successfully submitted.',
      message: 'You can access your case at any time from the case list below.',
    });
  });
};
