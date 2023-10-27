import {
  CASE_TYPES_MAP,
  COUNTRY_TYPES,
  DEFAULT_PROCEDURE_TYPE,
  PARTY_TYPES,
  PAYMENT_STATUS,
} from '../../../shared/src/business/entities/EntityConstants';
import { FORMATS } from '@shared/business/utilities/DateHandler';

export const petitionsClerkCreatesNewCaseFromPaper = (
  cerebralTest,
  fakeFile,
  {
    formOrdersAndNotices = {},
    paymentStatus = PAYMENT_STATUS.WAIVED,
    procedureType = 'Small',
    receivedAtDay = '01',
    receivedAtMonth = '01',
    receivedAtYear = '2001',
    trialLocation = 'Birmingham, Alabama',
  } = {},
  formOverrides = [],
) => {
  const primaryContactName = {
    key: 'contactPrimary.name',
    value: 'Shawn Johnson',
  };

  let formValues = [
    {
      key: 'mailingDate',
      value: 'Some Day',
    },
    {
      key: 'petitionFile',
      value: fakeFile,
    },
    {
      key: 'petitionFileSize',
      value: 1,
    },
    {
      key: 'cdsFile',
      value: fakeFile,
    },
    {
      key: 'cdsFileSize',
      value: 1,
    },
    {
      key: 'corporateDisclosureFile',
      value: fakeFile,
    },
    {
      key: 'corporateDisclosureFileSize',
      value: 1,
    },
    {
      key: 'requestForPlaceOfTrialFile',
      value: fakeFile,
    },
    {
      key: 'requestForPlaceOfTrialFileSize',
      value: 1,
    },
    {
      key: 'applicationForWaiverOfFilingFeeFile',
      value: fakeFile,
    },
    {
      key: 'applicationForWaiverOfFilingFeeFileSize',
      value: 1,
    },
    {
      key: 'preferredTrialCity',
      value: trialLocation,
    },
    {
      key: 'procedureType',
      value: procedureType,
    },
    {
      key: 'caseType',
      value: CASE_TYPES_MAP.deficiency,
    },
    {
      key: 'partyType',
      value: PARTY_TYPES.petitionerDeceasedSpouse,
    },
    {
      key: 'contactPrimary.countryType',
      value: COUNTRY_TYPES.INTERNATIONAL,
    },
    {
      key: 'contactPrimary.country',
      value: 'Switzerland',
    },
    primaryContactName,
    {
      key: 'contactPrimary.address1',
      value: '123 Abc Ln',
    },
    {
      key: 'contactPrimary.city',
      value: 'Cityville',
    },
    {
      key: 'contactPrimary.postalCode',
      value: '23-skidoo',
    },
    {
      key: 'contactPrimary.phone',
      value: '1234567890',
    },
    {
      key: 'contactSecondary.name',
      value: 'Julius Lenhart',
    },
    {
      key: 'contactSecondary.inCareOf',
      value: 'Nora Stanton Barney',
    },
    {
      key: 'petitionPaymentStatus',
      value: paymentStatus,
    },
    {
      key: 'orderForRatification',
      value: true,
    },
  ];

  formValues =
    formOrdersAndNotices &&
    formOrdersAndNotices.key &&
    formOrdersAndNotices.value
      ? [...formValues, formOrdersAndNotices]
      : formValues;

  formValues =
    formOverrides && formOverrides.length > 0
      ? [...formValues, ...formOverrides]
      : formValues;

  it('should default to parties tab when creating a new case', async () => {
    await cerebralTest.runSequence('gotoStartCaseWizardSequence');

    await cerebralTest.runSequence('submitPetitionFromPaperSequence');

    expect(cerebralTest.getState('currentPage')).toEqual('StartCaseInternal');
    expect(
      cerebralTest.getState('currentViewMetadata.startCaseInternal.tab'),
    ).toBe('partyInfo');
  });

  it('should default to Regular procedureType when creating a new case', () => {
    expect(cerebralTest.getState('form.procedureType')).toEqual(
      DEFAULT_PROCEDURE_TYPE,
    );
  });

  it('should generate case caption from primary and secondary contact information', async () => {
    for (const item of formValues) {
      if (item.key === 'partyType') {
        await cerebralTest.runSequence(
          'updateStartCaseInternalPartyTypeSequence',
          item,
        );
      } else if (item.key === 'petitionPaymentStatus') {
        await cerebralTest.runSequence(
          'updatePetitionPaymentFormValueSequence',
          item,
        );
      } else {
        await cerebralTest.runSequence('updateFormValueSequence', item);
      }
    }

    await cerebralTest.runSequence(
      'updateFormValueAndSecondaryContactInfoSequence',
      {
        key: 'useSameAsPrimary',
        value: true,
      },
    );

    await cerebralTest.runSequence(
      'updateFormValueAndCaseCaptionSequence',
      primaryContactName,
    );

    await cerebralTest.runSequence(
      'formatAndUpdateDateFromDatePickerSequence',
      {
        key: 'receivedAt',
        toFormat: FORMATS.ISO,
        value: `${receivedAtMonth}/${receivedAtDay}/${receivedAtYear}`,
      },
    );

    await cerebralTest.runSequence(
      'formatAndUpdateDateFromDatePickerSequence',
      {
        key: 'petitionPaymentWaivedDate',
        toFormat: FORMATS.ISO,
        value: '5/5/2005',
      },
    );

    await cerebralTest.runSequence('validatePetitionFromPaperSequence');

    expect(cerebralTest.getState('form.caseCaption')).toBe(
      'Shawn Johnson & Julius Lenhart, Deceased, Petitioners',
    );
    expect(cerebralTest.getState('form.contactSecondary.address1')).toBe(
      cerebralTest.getState('form.contactPrimary.address1'),
    );
    expect(cerebralTest.getState('form.contactSecondary.city')).toBe(
      cerebralTest.getState('form.contactPrimary.city'),
    );
    expect(cerebralTest.getState('form.contactSecondary.country')).toBe(
      cerebralTest.getState('form.contactPrimary.country'),
    );
    expect(cerebralTest.getState('form.contactSecondary.postalCode')).toBe(
      cerebralTest.getState('form.contactPrimary.postalCode'),
    );
    expect(cerebralTest.getState('form.contactSecondary.email')).toBe(
      cerebralTest.getState('form.contactPrimary.email'),
    );
    expect(cerebralTest.getState('form.contactSecondary.phone')).toBe(
      cerebralTest.getState('form.contactPrimary.phone'),
    );
    expect(cerebralTest.getState('form.contactSecondary.inCareOf')).toBe(
      'Nora Stanton Barney',
    );
  });

  const updatedCaseCaption = 'Ada Lovelace is awesome';

  it('should regenerate case caption when primary contact name is changed', async () => {
    await cerebralTest.runSequence('updateFormValueAndCaseCaptionSequence', {
      key: 'contactPrimary.name',
      value: 'Ada Lovelace',
    });

    expect(cerebralTest.getState('form.caseCaption')).toBe(
      'Ada Lovelace & Julius Lenhart, Deceased, Petitioners',
    );

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'caseCaption',
      value: updatedCaseCaption,
    });

    expect(cerebralTest.getState('form.caseCaption')).toBe(updatedCaseCaption);
  });
};
