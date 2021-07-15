import { CaseInternal } from '../../../shared/src/business/entities/cases/CaseInternal';
import { applicationContextForClient as applicationContext } from '../../../shared/src/business/test/createTestApplicationContext';

const { VALIDATION_ERROR_MESSAGES } = CaseInternal;

const { CASE_TYPES_MAP, COUNTRY_TYPES, PARTY_TYPES, PAYMENT_STATUS } =
  applicationContext.getConstants();

export const petitionsClerkCreatesNewCase = (
  cerebralTest,
  fakeFile,
  trialLocation = 'Birmingham, Alabama',
  shouldServe = true,
) => {
  return it('Petitions clerk creates a new case', async () => {
    await cerebralTest.runSequence('gotoStartCaseWizardSequence');
    expect(cerebralTest.getState('form.hasVerifiedIrsNotice')).toEqual(false);

    await cerebralTest.runSequence('submitPetitionFromPaperSequence');

    expect(cerebralTest.getState('alertError.title')).toEqual(
      'Please correct the following errors on the page:',
    );

    expect(cerebralTest.getState('validationErrors.caseCaption')).toEqual(
      VALIDATION_ERROR_MESSAGES.caseCaption,
    );

    expect(cerebralTest.getState('validationErrors.receivedAt')).toEqual(
      VALIDATION_ERROR_MESSAGES.receivedAt[1],
    );

    expect(cerebralTest.getState('validationErrors.petitionFile')).toEqual(
      VALIDATION_ERROR_MESSAGES.petitionFile,
    );

    expect(
      cerebralTest.getState('validationErrors.requestForPlaceOfTrialFile'),
    ).toBeUndefined();

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'receivedAtMonth',
      value: '01',
    });
    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'receivedAtDay',
      value: '01',
    });
    const receivedAtYear = '2001';
    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'receivedAtYear',
      value: receivedAtYear,
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'mailingDate',
      value: 'Some Day',
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'caseCaption',
      value:
        'Daenerys Stormborn, Deceased, Daenerys Stormborn, Surviving Spouse, Petitioner',
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'preferredTrialCity',
      value: trialLocation,
    });

    await cerebralTest.runSequence('submitPetitionFromPaperSequence');

    expect(
      cerebralTest.getState('validationErrors.requestForPlaceOfTrialFile'),
    ).toEqual(VALIDATION_ERROR_MESSAGES.requestForPlaceOfTrialFile);

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'petitionFile',
      value: fakeFile,
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'petitionFileSize',
      value: 1,
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'stinFile',
      value: fakeFile,
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'stinFileSize',
      value: 1,
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'ownershipDisclosureFile',
      value: fakeFile,
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'ownershipDisclosureFileSize',
      value: 1,
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'requestForPlaceOfTrialFile',
      value: fakeFile,
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'requestForPlaceOfTrialFileSize',
      value: 1,
    });

    await cerebralTest.runSequence('submitPetitionFromPaperSequence');

    expect(
      cerebralTest.getState('validationErrors.requestForPlaceOfTrialFile'),
    ).toBeUndefined();

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'applicationForWaiverOfFilingFeeFile',
      value: fakeFile,
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'applicationForWaiverOfFilingFeeFileSize',
      value: 1,
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'procedureType',
      value: 'Small',
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'caseType',
      value: CASE_TYPES_MAP.deficiency,
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'partyType',
      value: PARTY_TYPES.petitioner,
    });

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

    await cerebralTest.runSequence('updatePetitionPaymentFormValueSequence', {
      key: 'petitionPaymentStatus',
      value: PAYMENT_STATUS.UNPAID,
    });

    await cerebralTest.runSequence('validatePetitionFromPaperSequence');
    expect(cerebralTest.getState('alertError')).toBeUndefined();
    expect(cerebralTest.getState('validationErrors')).toEqual({});

    await cerebralTest.runSequence('submitPetitionFromPaperSequence');

    expect(cerebralTest.getState('currentPage')).toEqual('ReviewSavedPetition');

    const docketNumber = cerebralTest.getState('caseDetail.docketNumber');
    const receivedDocketNumberYear = docketNumber.slice(-2);
    const expectedDocketNumberYear = receivedAtYear.slice(-2);
    expect(receivedDocketNumberYear).toBe(expectedDocketNumberYear);

    if (shouldServe) {
      await cerebralTest.runSequence('serveCaseToIrsSequence');
    }

    await cerebralTest.runSequence('gotoCaseDetailSequence');

    cerebralTest.docketNumber = cerebralTest.getState(
      'caseDetail.docketNumber',
    );
    expect(cerebralTest.getState('caseDetail.preferredTrialCity')).toEqual(
      trialLocation,
    );
    if (cerebralTest.casesReadyForTrial) {
      cerebralTest.casesReadyForTrial.push(cerebralTest.docketNumber);
    }
  });
};
