import { applicationContextForClient as applicationContext } from '../../../shared/src/business/test/createTestApplicationContext';
import { reviewSavedPetitionHelper as reviewSavedPetitionHelperComputed } from '../../src/presenter/computeds/reviewSavedPetitionHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const reviewSavedPetitionHelper = withAppContextDecorator(
  reviewSavedPetitionHelperComputed,
);
const {
  COUNTRY_TYPES,
  DEFAULT_PROCEDURE_TYPE,
  PARTY_TYPES,
  PAYMENT_STATUS,
} = applicationContext.getConstants();

export const petitionsClerkCreatesNewCaseFromPaper = (
  test,
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
      value: 'Deficiency',
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
      key: 'contactPrimary.email',
      value: 'test@example.com',
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
    await test.runSequence('gotoStartCaseWizardSequence');
    await test.runSequence('submitPetitionFromPaperSequence');

    expect(test.getState('currentPage')).toEqual('StartCaseInternal');
    expect(test.getState('currentViewMetadata.startCaseInternal.tab')).toBe(
      'partyInfo',
    );
  });

  it('should default to Regular procedureType when creating a new case', async () => {
    expect(test.getState('form.procedureType')).toEqual(DEFAULT_PROCEDURE_TYPE);
  });

  it('should generate case caption from primary and secondary contact information', async () => {
    for (const item of formValues) {
      if (item.key === 'partyType') {
        await test.runSequence(
          'updateStartCaseInternalPartyTypeSequence',
          item,
        );
      } else if (item.key === 'petitionPaymentStatus') {
        await test.runSequence('updatePetitionPaymentFormValueSequence', item);
      } else {
        await test.runSequence('updateFormValueSequence', item);
      }
    }

    await test.runSequence('updateFormValueAndSecondaryContactInfoSequence', {
      key: 'useSameAsPrimary',
      value: true,
    });
    await test.runSequence(
      'updateFormValueAndCaseCaptionSequence',
      primaryContactName,
    );
    await test.runSequence('validatePetitionFromPaperSequence');

    expect(test.getState('form.caseCaption')).toBe(
      'Shawn Johnson & Julius Lenhart, Deceased, Shawn Johnson, Surviving Spouse, Petitioners',
    );
    expect(test.getState('form.contactSecondary.address1')).toBe(
      test.getState('form.contactPrimary.address1'),
    );
    expect(test.getState('form.contactSecondary.city')).toBe(
      test.getState('form.contactPrimary.city'),
    );
    expect(test.getState('form.contactSecondary.country')).toBe(
      test.getState('form.contactPrimary.country'),
    );
    expect(test.getState('form.contactSecondary.postalCode')).toBe(
      test.getState('form.contactPrimary.postalCode'),
    );
    expect(test.getState('form.contactSecondary.email')).toBe(
      test.getState('form.contactPrimary.email'),
    );
    expect(test.getState('form.contactSecondary.phone')).toBe(
      test.getState('form.contactPrimary.phone'),
    );
    expect(test.getState('form.contactSecondary.inCareOf')).toBe(
      'Nora Stanton Barney',
    );
  });

  const updatedCaseCaption = 'Ada Lovelace is awesome';

  it('should regenerate case caption when primary contact name is changed', async () => {
    await test.runSequence('updateFormValueAndCaseCaptionSequence', {
      key: 'contactPrimary.name',
      value: 'Ada Lovelace',
    });

    expect(test.getState('form.caseCaption')).toBe(
      'Ada Lovelace & Julius Lenhart, Deceased, Ada Lovelace, Surviving Spouse, Petitioners',
    );

    await test.runSequence('updateFormValueSequence', {
      key: 'caseCaption',
      value: updatedCaseCaption,
    });

    expect(test.getState('form.caseCaption')).toBe(updatedCaseCaption);
  });

  it('should create case and navigate to review screen when case information has been validated', async () => {
    await test.runSequence('submitPetitionFromPaperSequence');
    expect(test.getState('alertError')).toBeUndefined();
    expect(test.getState('validationErrors')).toEqual({});

    expect(test.getState('currentPage')).toEqual('ReviewSavedPetition');

    const helper = runCompute(reviewSavedPetitionHelper, {
      state: test.getState(),
    });

    expect(helper).toMatchObject({
      hasIrsNoticeFormatted: 'No',
      hasOrders: true,
      petitionPaymentStatusFormatted: 'Waived 05/05/05',
      receivedAtFormatted: '01/01/01',
      shouldShowIrsNoticeDate: false,
    });

    expect(test.getState('caseDetail')).toMatchObject({
      caseCaption: updatedCaseCaption,
      isPaper: true,
    });
  });
};
