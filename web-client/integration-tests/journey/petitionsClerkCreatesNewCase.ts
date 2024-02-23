import {
  CASE_TYPES_MAP,
  COUNTRY_TYPES,
  PARTY_TYPES,
  PAYMENT_STATUS,
} from '../../../shared/src/business/entities/EntityConstants';
import { FORMATS } from '@shared/business/utilities/DateHandler';
import {
  fakeFile,
  waitForLoadingComponentToHide,
  waitForModalsToHide,
} from '../helpers';

export const petitionsClerkCreatesNewCase = (
  cerebralTest,
  overrides?: {
    procedureType?: string;
    receivedAtDay?: string;
    receivedAtMonth?: string;
    receivedAtYear?: string;
    shouldServe?: boolean;
    trialLocation?: string;
  },
) => {
  const defaults = {
    procedureType: 'Small',
    receivedAtDay: '01',
    receivedAtMonth: '01',
    receivedAtYear: '2001',
    shouldServe: true,
    trialLocation: 'Birmingham, Alabama',
  };
  overrides = Object.assign(defaults, overrides || {});

  return it('Petitions clerk creates a new case', async () => {
    await cerebralTest.runSequence('gotoStartCaseWizardSequence');
    expect(cerebralTest.getState('form.hasVerifiedIrsNotice')).toEqual(false);

    await cerebralTest.runSequence('submitPetitionFromPaperSequence');

    expect(cerebralTest.getState('alertError.title')).toEqual(
      'Please correct the following errors on the page:',
    );

    expect(cerebralTest.getState('validationErrors.caseCaption')).toEqual(
      'Enter a case caption',
    );

    expect(cerebralTest.getState('validationErrors.receivedAt')).toEqual(
      'Enter a valid date received',
    );

    expect(cerebralTest.getState('validationErrors.petitionFile')).toEqual(
      'Upload or scan a Petition',
    );

    expect(
      cerebralTest.getState('validationErrors.requestForPlaceOfTrialFile'),
    ).toBeUndefined();

    await cerebralTest.runSequence(
      'formatAndUpdateDateFromDatePickerSequence',
      {
        key: 'receivedAt',
        toFormat: FORMATS.ISO,
        value: `${overrides?.receivedAtMonth}/${overrides?.receivedAtDay}/${overrides?.receivedAtYear}`,
      },
    );

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
      value: overrides?.trialLocation,
    });

    await cerebralTest.runSequence('submitPetitionFromPaperSequence');

    expect(
      cerebralTest.getState('validationErrors.requestForPlaceOfTrialFile'),
    ).toEqual('Upload or scan a Request for Place of Trial (RQT)');

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
      key: 'corporateDisclosureFile',
      value: fakeFile,
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'corporateDisclosureFileSize',
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
      value: overrides?.procedureType,
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
      value: PAYMENT_STATUS.PAID,
    });

    await cerebralTest.runSequence(
      'formatAndUpdateDateFromDatePickerSequence',
      {
        key: 'petitionPaymentDate',
        toFormat: FORMATS.ISO,
        value: '01/01/2001',
      },
    );

    await cerebralTest.runSequence('updatePetitionPaymentFormValueSequence', {
      key: 'petitionPaymentMethod',
      value: 'Money, I guess',
    });

    await cerebralTest.runSequence('validatePetitionFromPaperSequence');
    expect(cerebralTest.getState('alertError')).toBeUndefined();
    expect(cerebralTest.getState('validationErrors')).toEqual({});

    await cerebralTest.runSequence('submitPetitionFromPaperSequence');

    expect(cerebralTest.getState('currentPage')).toEqual('ReviewSavedPetition');

    const docketNumber = cerebralTest.getState('caseDetail.docketNumber');
    const receivedDocketNumberYear = docketNumber.slice(-2);
    const expectedDocketNumberYear = overrides?.receivedAtYear?.slice(-2);
    expect(receivedDocketNumberYear).toBe(expectedDocketNumberYear);

    if (overrides?.shouldServe) {
      await cerebralTest.runSequence('serveCaseToIrsSequence');

      await waitForLoadingComponentToHide({ cerebralTest });
      await waitForModalsToHide({ cerebralTest, maxWait: 120000 });
    }

    await cerebralTest.runSequence('gotoCaseDetailSequence');

    cerebralTest.docketNumber = cerebralTest.getState(
      'caseDetail.docketNumber',
    );
    expect(cerebralTest.getState('caseDetail.preferredTrialCity')).toEqual(
      overrides?.trialLocation,
    );
    if (cerebralTest.casesReadyForTrial) {
      cerebralTest.casesReadyForTrial.push(cerebralTest.docketNumber);
    }
  });
};
