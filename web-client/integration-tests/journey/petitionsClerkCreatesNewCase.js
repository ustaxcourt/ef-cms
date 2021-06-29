import { CaseInternal } from '../../../shared/src/business/entities/cases/CaseInternal';
import { applicationContextForClient as applicationContext } from '../../../shared/src/business/test/createTestApplicationContext';

const { VALIDATION_ERROR_MESSAGES } = CaseInternal;

const { CASE_TYPES_MAP, COUNTRY_TYPES, PARTY_TYPES, PAYMENT_STATUS } =
  applicationContext.getConstants();

export const petitionsClerkCreatesNewCase = (
  test,
  fakeFile,
  trialLocation = 'Birmingham, Alabama',
  shouldServe = true,
) => {
  return it('Petitions clerk creates a new case', async () => {
    await test.runSequence('gotoStartCaseWizardSequence');
    expect(test.getState('form.hasVerifiedIrsNotice')).toEqual(false);

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

    expect(
      test.getState('validationErrors.requestForPlaceOfTrialFile'),
    ).toBeUndefined();

    await test.runSequence('updateFormValueSequence', {
      key: 'receivedAtMonth',
      value: '01',
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'receivedAtDay',
      value: '01',
    });
    const receivedAtYear = '2001';
    await test.runSequence('updateFormValueSequence', {
      key: 'receivedAtYear',
      value: receivedAtYear,
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'mailingDate',
      value: 'Some Day',
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'caseCaption',
      value:
        'Daenerys Stormborn, Deceased, Daenerys Stormborn, Surviving Spouse, Petitioner',
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'preferredTrialCity',
      value: trialLocation,
    });

    await test.runSequence('submitPetitionFromPaperSequence');

    expect(
      test.getState('validationErrors.requestForPlaceOfTrialFile'),
    ).toEqual(VALIDATION_ERROR_MESSAGES.requestForPlaceOfTrialFile);

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

    await test.runSequence('submitPetitionFromPaperSequence');

    expect(
      test.getState('validationErrors.requestForPlaceOfTrialFile'),
    ).toBeUndefined();

    await test.runSequence('updateFormValueSequence', {
      key: 'applicationForWaiverOfFilingFeeFile',
      value: fakeFile,
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'applicationForWaiverOfFilingFeeFileSize',
      value: 1,
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'procedureType',
      value: 'Small',
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'caseType',
      value: CASE_TYPES_MAP.deficiency,
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'partyType',
      value: PARTY_TYPES.petitioner,
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.countryType',
      value: COUNTRY_TYPES.INTERNATIONAL,
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.country',
      value: 'Switzerland',
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.name',
      value: 'Daenerys Stormborn',
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
      key: 'contactPrimary.phone',
      value: '1234567890',
    });

    await test.runSequence('updatePetitionPaymentFormValueSequence', {
      key: 'petitionPaymentStatus',
      value: PAYMENT_STATUS.UNPAID,
    });

    await test.runSequence('validatePetitionFromPaperSequence');
    expect(test.getState('alertError')).toBeUndefined();
    expect(test.getState('validationErrors')).toEqual({});

    await test.runSequence('submitPetitionFromPaperSequence');

    expect(test.getState('currentPage')).toEqual('ReviewSavedPetition');

    const docketNumber = test.getState('caseDetail.docketNumber');
    const receivedDocketNumberYear = docketNumber.slice(-2);
    const expectedDocketNumberYear = receivedAtYear.slice(-2);
    expect(receivedDocketNumberYear).toBe(expectedDocketNumberYear);

    if (shouldServe) {
      await test.runSequence('serveCaseToIrsSequence');
    }

    await test.runSequence('gotoCaseDetailSequence');

    test.docketNumber = test.getState('caseDetail.docketNumber');
    expect(test.getState('caseDetail.preferredTrialCity')).toEqual(
      trialLocation,
    );
    if (test.casesReadyForTrial) {
      test.casesReadyForTrial.push(test.docketNumber);
    }
  });
};
