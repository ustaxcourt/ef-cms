import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { reviewSavedPetitionHelper as reviewSavedPetitionHelperComputed } from './reviewSavedPetitionHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../withAppContext';

const {
  INITIAL_DOCUMENT_TYPES,
  PAYMENT_STATUS,
} = applicationContext.getConstants();

const reviewSavedPetitionHelper = withAppContextDecorator(
  reviewSavedPetitionHelperComputed,
  applicationContext,
);

describe('reviewSavedPetitionHelper', () => {
  it('returns defaults when there is no form', () => {
    const result = runCompute(reviewSavedPetitionHelper, {
      state: {
        form: {},
      },
    });
    expect(result).toMatchObject({
      hasIrsNoticeFormatted: 'No',
      hasOrders: false,
      irsNoticeDateFormatted: undefined,
      ownershipDisclosureFile: undefined,
      petitionFile: undefined,
      petitionPaymentStatusFormatted: PAYMENT_STATUS.UNPAID,
      preferredTrialCityFormatted: 'No requested place of trial',
      receivedAtFormatted: undefined,
      requestForPlaceOfTrialFile: undefined,
      shouldShowIrsNoticeDate: false,
      stinFile: undefined,
    });
  });

  it('returns defaults when the are values', () => {
    const result = runCompute(reviewSavedPetitionHelper, {
      state: {
        form: {
          documents: [
            { documentType: INITIAL_DOCUMENT_TYPES.petition.documentType },
            {
              documentType:
                INITIAL_DOCUMENT_TYPES.requestForPlaceOfTrial.documentType,
            },
            {
              documentType:
                INITIAL_DOCUMENT_TYPES.ownershipDisclosure.documentType,
            },
            { documentType: INITIAL_DOCUMENT_TYPES.stin.documentType },
            {
              documentType:
                INITIAL_DOCUMENT_TYPES.applicationForWaiverOfFilingFee
                  .documentType,
            },
          ],
          hasVerifiedIrsNotice: true,
          irsNoticeDate: '2020-01-05T03:30:45.007Z',
          orderForAmendedPetitionAndFilingFee: true,
          petitionPaymentDate: '2020-03-14T14:02:04.007Z',
          petitionPaymentMethod: 'pay.gov',
          petitionPaymentStatus: PAYMENT_STATUS.PAID,
          receivedAt: '2020-01-05T03:30:45.007Z',
        },
      },
    });

    expect(result).toMatchObject({
      applicationForWaiverOfFilingFeeFile: {
        documentType:
          INITIAL_DOCUMENT_TYPES.applicationForWaiverOfFilingFee.documentType,
      },
      hasIrsNoticeFormatted: 'Yes',
      hasOrders: true,
      irsNoticeDateFormatted: '01/04/20',
      ownershipDisclosureFile: {
        documentType: INITIAL_DOCUMENT_TYPES.ownershipDisclosure.documentType,
      },
      petitionFile: {
        documentType: INITIAL_DOCUMENT_TYPES.petition.documentType,
      },
      petitionPaymentStatusFormatted: 'Paid 03/14/20 pay.gov',
      preferredTrialCityFormatted: 'No requested place of trial',
      receivedAtFormatted: '01/04/20',
      requestForPlaceOfTrialFile: {
        documentType:
          INITIAL_DOCUMENT_TYPES.requestForPlaceOfTrial.documentType,
      },
      shouldShowIrsNoticeDate: true,
      stinFile: { documentType: INITIAL_DOCUMENT_TYPES.stin.documentType },
    });
  });

  it('returns a petitionPaymentStatusFormatted for a waived payment status', () => {
    const result = runCompute(reviewSavedPetitionHelper, {
      state: {
        form: {
          petitionPaymentStatus: PAYMENT_STATUS.WAIVED,
          petitionPaymentWaivedDate: '2019-03-01T21:40:46.415Z',
        },
      },
    });

    expect(result).toMatchObject({
      petitionPaymentStatusFormatted: 'Waived 03/01/19',
    });
  });

  it('returns a message when preferred trial city has not been selected', () => {
    const result = runCompute(reviewSavedPetitionHelper, {
      state: {
        form: {},
      },
    });

    expect(result).toMatchObject({
      hasIrsNoticeFormatted: 'No',
      hasOrders: false,
      irsNoticeDateFormatted: undefined,
      ownershipDisclosureFile: undefined,
      petitionFile: undefined,
      petitionPaymentStatusFormatted: PAYMENT_STATUS.UNPAID,
      preferredTrialCityFormatted: 'No requested place of trial',
      receivedAtFormatted: undefined,
      requestForPlaceOfTrialFile: undefined,
      shouldShowIrsNoticeDate: false,
      stinFile: undefined,
    });
  });

  it('returns a preferred trial city when it has been selected', () => {
    const mockCity = 'Nowhere, USA';
    const result = runCompute(reviewSavedPetitionHelper, {
      state: {
        form: {
          preferredTrialCity: mockCity,
        },
      },
    });

    expect(result).toMatchObject({
      hasIrsNoticeFormatted: 'No',
      hasOrders: false,
      irsNoticeDateFormatted: undefined,
      ownershipDisclosureFile: undefined,
      petitionFile: undefined,
      petitionPaymentStatusFormatted: PAYMENT_STATUS.UNPAID,
      preferredTrialCityFormatted: mockCity,
      receivedAtFormatted: undefined,
      requestForPlaceOfTrialFile: undefined,
      shouldShowIrsNoticeDate: false,
      stinFile: undefined,
    });
  });

  [
    'orderForAmendedPetition',
    'orderForAmendedPetitionAndFilingFee',
    'orderForFilingFee',
    'orderForOds',
    'orderForRatification',
    'orderToShowCause',
    'noticeOfAttachments',
    'orderDesignatingPlaceOfTrial',
  ].forEach(order => {
    it(`verify hasOrders is true if ${order} is set`, () => {
      const result = runCompute(reviewSavedPetitionHelper, {
        state: {
          form: {
            [order]: true,
          },
        },
      });

      expect(result).toMatchObject({
        hasOrders: true,
      });
    });
  });

  it('returns showStatistics false if the statistics array is not present on the form', () => {
    const result = runCompute(reviewSavedPetitionHelper, {
      state: {
        form: {},
      },
    });

    expect(result.showStatistics).toBeFalsy();
  });

  it('returns showStatistics false if the statistics array is present on the form but has length 0', () => {
    const result = runCompute(reviewSavedPetitionHelper, {
      state: {
        form: { statistics: [] },
      },
    });

    expect(result.showStatistics).toBeFalsy();
  });

  it('returns showStatistics true if the statistics array is present on the form and has length greater than 0', () => {
    const result = runCompute(reviewSavedPetitionHelper, {
      state: {
        form: { statistics: [{ yearOrPeriod: 'Year' }] },
      },
    });

    expect(result.showStatistics).toBeTruthy();
  });

  it('formats statistics with formatted dates and money', () => {
    const result = runCompute(reviewSavedPetitionHelper, {
      state: {
        form: {
          statistics: [
            {
              irsDeficiencyAmount: 123,
              irsTotalPenalties: 30000,
              year: '2012',
              yearOrPeriod: 'Year',
            },
            {
              irsDeficiencyAmount: 0,
              irsTotalPenalties: 21,
              lastDateOfPeriod: '2019-03-01T21:40:46.415Z',
              yearOrPeriod: 'Period',
            },
          ],
        },
      },
    });

    expect(result.formattedStatistics).toMatchObject([
      {
        formattedDate: '2012',
        formattedIrsDeficiencyAmount: '$123.00',
        formattedIrsTotalPenalties: '$30,000.00',
      },
      {
        formattedDate: '03/01/19',
        formattedIrsDeficiencyAmount: '$0.00',
        formattedIrsTotalPenalties: '$21.00',
      },
    ]);
  });
});
