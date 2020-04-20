import { applicationContext } from '../../applicationContext';
import { reviewPetitionFromPaperHelper as reviewPetitionFromPaperHelperComputed } from './reviewPetitionFromPaperHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../withAppContext';

const { PAYMENT_STATUS } = applicationContext.getConstants();

const reviewPetitionFromPaperHelper = withAppContextDecorator(
  reviewPetitionFromPaperHelperComputed,
  {
    ...applicationContext,
    getConstants: () => {
      return {
        ...applicationContext.getConstants(),
      };
    },
  },
);

describe('reviewPetitionFromPaperHelper', () => {
  it('returns defaults when there is no form', () => {
    const result = runCompute(reviewPetitionFromPaperHelper, {
      state: {
        form: {},
      },
    });
    expect(result).toEqual({
      hasIrsNoticeFormatted: 'No',
      hasOrders: false,
      irsNoticeDateFormatted: undefined,
      petitionPaymentStatusFormatted: 'Not paid',
      preferredTrialCityFormatted: 'No requested place of trial',
      receivedAtFormatted: undefined,
      shouldShowIrsNoticeDate: false,
    });
  });

  it('return formatted/computed values based on form inputs', () => {
    const result = runCompute(reviewPetitionFromPaperHelper, {
      state: {
        form: {
          dateReceived: '2020-01-05T03:30:45.007Z',
          hasVerifiedIrsNotice: true,
          irsNoticeDate: '2020-01-05T03:30:45.007Z',
          mailingDate: '2020-01-05T03:30:45.007Z',
          petitionPaymentDate: '2020-03-14T14:02:04.007Z',
          petitionPaymentMethod: 'pay.gov',
          petitionPaymentStatus: PAYMENT_STATUS.PAID,
          preferredTrialCity: 'Cooper Station',
        },
      },
    });

    expect(result).toEqual({
      hasIrsNoticeFormatted: 'Yes',
      hasOrders: false,
      irsNoticeDateFormatted: '01/04/2020',
      petitionPaymentStatusFormatted: 'Paid 03/14/2020 pay.gov',
      preferredTrialCityFormatted: 'Cooper Station',
      receivedAtFormatted: '01/04/2020',
      shouldShowIrsNoticeDate: true,
    });
  });

  it('should show orders needed summary if there are orders selected', () => {
    const result = runCompute(reviewPetitionFromPaperHelper, {
      state: {
        form: {
          orderForFilingFee: true,
        },
      },
    });

    expect(result).toEqual({
      hasIrsNoticeFormatted: 'No',
      hasOrders: true,
      irsNoticeDateFormatted: undefined,
      petitionPaymentStatusFormatted: 'Not paid',
      preferredTrialCityFormatted: 'No requested place of trial',
      receivedAtFormatted: undefined,
      shouldShowIrsNoticeDate: false,
    });
  });

  it('should show orders needed summary when order designating place of trial has been selected', () => {
    const result = runCompute(reviewPetitionFromPaperHelper, {
      state: {
        form: {
          orderForRequestedTrialLocation: true,
        },
      },
    });

    expect(result).toEqual({
      hasIrsNoticeFormatted: 'No',
      hasOrders: true,
      irsNoticeDateFormatted: undefined,
      petitionPaymentStatusFormatted: 'Not paid',
      preferredTrialCityFormatted: 'No requested place of trial',
      receivedAtFormatted: undefined,
      shouldShowIrsNoticeDate: false,
    });
  });
});
