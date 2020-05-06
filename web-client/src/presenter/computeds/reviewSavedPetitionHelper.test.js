import { applicationContext } from '../../applicationContext';
import { reviewSavedPetitionHelper as reviewSavedPetitionHelperComputed } from './reviewSavedPetitionHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../withAppContext';

const {
  INITIAL_DOCUMENT_TYPES,
  PAYMENT_STATUS,
} = applicationContext.getConstants();

const reviewSavedPetitionHelper = withAppContextDecorator(
  reviewSavedPetitionHelperComputed,
  {
    ...applicationContext,
    getConstants: () => {
      return {
        ...applicationContext.getConstants(),
      };
    },
  },
);

describe('reviewSavedPetitionHelper', () => {
  it('returns defaults when there is no form', () => {
    const result = runCompute(reviewSavedPetitionHelper, {
      state: {
        form: {},
      },
    });
    expect(result).toEqual({
      hasIrsNoticeFormatted: 'No',
      hasOrders: false,
      irsNoticeDateFormatted: undefined,
      ownershipDisclosureFile: undefined,
      petitionFile: undefined,
      petitionPaymentStatusFormatted: 'Not paid',
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

    expect(result).toEqual({
      hasIrsNoticeFormatted: 'Yes',
      hasOrders: true,
      irsNoticeDateFormatted: '01/04/2020',
      ownershipDisclosureFile: {
        documentType: INITIAL_DOCUMENT_TYPES.ownershipDisclosure.documentType,
      },
      petitionFile: {
        documentType: INITIAL_DOCUMENT_TYPES.petition.documentType,
      },
      petitionPaymentStatusFormatted: 'Paid 03/14/2020 pay.gov',
      preferredTrialCityFormatted: 'No requested place of trial',
      receivedAtFormatted: '01/04/2020',
      requestForPlaceOfTrialFile: {
        documentType:
          INITIAL_DOCUMENT_TYPES.requestForPlaceOfTrial.documentType,
      },
      shouldShowIrsNoticeDate: true,
      stinFile: { documentType: INITIAL_DOCUMENT_TYPES.stin.documentType },
    });
  });

  it('returns a message when preferred trial city has not been selected', () => {
    const result = runCompute(reviewSavedPetitionHelper, {
      state: {
        form: {},
      },
    });

    expect(result).toEqual({
      hasIrsNoticeFormatted: 'No',
      hasOrders: false,
      irsNoticeDateFormatted: undefined,
      ownershipDisclosureFile: undefined,
      petitionFile: undefined,
      petitionPaymentStatusFormatted: 'Not paid',
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

    expect(result).toEqual({
      hasIrsNoticeFormatted: 'No',
      hasOrders: false,
      irsNoticeDateFormatted: undefined,
      ownershipDisclosureFile: undefined,
      petitionFile: undefined,
      petitionPaymentStatusFormatted: 'Not paid',
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
});
