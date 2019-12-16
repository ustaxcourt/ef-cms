import { Case } from '../../../shared/src/business/entities/cases/Case';

const { VALIDATION_ERROR_MESSAGES } = Case;

export default (test, fakeFile, trialLocation = 'Birmingham, Alabama') => {
  return it('Petitions clerk creates a new case', async () => {
    await test.runSequence('gotoStartCaseWizardSequence');
    await test.runSequence('submitPetitionFromPaperSequence');

    expect(test.getState('alertError.title')).toEqual(
      'Please correct the following errors on the page:',
    );

    expect(test.getState('validationErrors.caseCaption')).toEqual(
      VALIDATION_ERROR_MESSAGES.caseCaption,
    );

    expect(test.getState('validationErrors.receivedAt')).toEqual(
      VALIDATION_ERROR_MESSAGES.receivedAt[1],
    );

    expect(test.getState('validationErrors.petitionFile')).toEqual(
      VALIDATION_ERROR_MESSAGES.petitionFile,
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

    await test.runSequence('updateFormValueSequence', {
      key: 'petitionFile',
      value: fakeFile,
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'petitionFileSize',
      value: 1,
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'stinFile',
      value: fakeFile,
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'stinFileSize',
      value: 1,
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'ownershipDisclosureFile',
      value: fakeFile,
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'ownershipDisclosureFileSize',
      value: 1,
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'requestForPlaceOfTrialFile',
      value: fakeFile,
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'requestForPlaceOfTrialFileSize',
      value: 1,
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'applicationForWaiverOfFilingFeeFile',
      value: fakeFile,
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'applicationForWaiverOfFilingFeeFileSize',
      value: 1,
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'preferredTrialCity',
      value: trialLocation,
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'procedureType',
      value: 'Small',
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'caseType',
      value: 'Deficiency',
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'partyType',
      value: 'Petitioner',
    });

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

    await test.runSequence('updateFormValueSequence', {
      key: 'mailingDate',
      value: 'testing',
    });

    await test.runSequence('validatePetitionFromPaperSequence');
    expect(test.getState('alertError')).toBeUndefined();
    expect(test.getState('validationErrors')).toEqual({});

    await test.runSequence('submitPetitionFromPaperSequence');

    expect(test.getState('currentPage')).toEqual('DocumentDetail');

    test.docketNumber = test.getState('caseDetail.docketNumber');
    test.caseId = test.getState('caseDetail.caseId');
  });
};
