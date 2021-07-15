import { CASE_TYPES_MAP } from '../../../shared/src/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '../../../shared/src/business/test/createTestApplicationContext';
import { reviewSavedPetitionHelper as reviewSavedPetitionHelperComputed } from '../../src/presenter/computeds/reviewSavedPetitionHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const reviewSavedPetitionHelper = withAppContextDecorator(
  reviewSavedPetitionHelperComputed,
);
const { COUNTRY_TYPES, DEFAULT_PROCEDURE_TYPE, PARTY_TYPES, PAYMENT_STATUS } =
  applicationContext.getConstants();

export const petitionsClerkCreatesNewCaseFromPaper = (
  cerebralTest,
  fakeFile,
  trialLocation = 'Birmingham, Alabama',
) => {
  const primaryContactName = {
    key: 'contactPrimary.name',
    value: 'Shawn Johnson',
  };

  const formValues = [
    {
      key: 'receivedAtMonth',
      value: '01',
    },
    {
      key: 'receivedAtDay',
      value: '01',
    },
    {
      key: 'receivedAtYear',
      value: '2001',
    },
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
      key: 'odsFile',
      value: fakeFile,
    },
    {
      key: 'odsFileSize',
      value: 1,
    },
    {
      key: 'ownershipDisclosureFile',
      value: fakeFile,
    },
    {
      key: 'ownershipDisclosureFileSize',
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
      value: 'Small',
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
      value: PAYMENT_STATUS.WAIVED,
    },
    {
      key: 'paymentDateWaivedDay',
      value: '05',
    },
    {
      key: 'paymentDateWaivedMonth',
      value: '05',
    },
    {
      key: 'paymentDateWaivedYear',
      value: '2005',
    },
    {
      key: 'orderForRatification',
      value: true,
    },
  ];

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
    await cerebralTest.runSequence('validatePetitionFromPaperSequence');

    expect(cerebralTest.getState('form.caseCaption')).toBe(
      'Shawn Johnson & Julius Lenhart, Deceased, Shawn Johnson, Surviving Spouse, Petitioners',
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
      'Ada Lovelace & Julius Lenhart, Deceased, Ada Lovelace, Surviving Spouse, Petitioners',
    );

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'caseCaption',
      value: updatedCaseCaption,
    });

    expect(cerebralTest.getState('form.caseCaption')).toBe(updatedCaseCaption);
  });

  it('should create case and navigate to review screen when case information has been validated', async () => {
    await cerebralTest.runSequence('submitPetitionFromPaperSequence');
    expect(cerebralTest.getState('alertError')).toBeUndefined();
    expect(cerebralTest.getState('validationErrors')).toEqual({});

    expect(cerebralTest.getState('currentPage')).toEqual('ReviewSavedPetition');

    const helper = runCompute(reviewSavedPetitionHelper, {
      state: cerebralTest.getState(),
    });

    expect(helper).toMatchObject({
      hasIrsNoticeFormatted: 'No',
      hasOrders: true,
      petitionPaymentStatusFormatted: 'Waived 05/05/05',
      receivedAtFormatted: '01/01/01',
      shouldShowIrsNoticeDate: false,
    });

    expect(cerebralTest.getState('caseDetail')).toMatchObject({
      caseCaption: updatedCaseCaption,
      isPaper: true,
    });

    cerebralTest.docketNumber = cerebralTest.getState(
      'caseDetail.docketNumber',
    );
  });
};
