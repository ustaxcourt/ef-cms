import { applicationContext } from '../../applicationContext';
import { reviewPetitionHelper as reviewPetitionHelperComputed } from './reviewPetitionHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../withAppContext';

const { PAYMENT_STATUS } = applicationContext.getConstants();

const reviewPetitionHelper = withAppContextDecorator(
  reviewPetitionHelperComputed,
  {
    ...applicationContext,
    getConstants: () => {
      return {
        ...applicationContext.getConstants(),
      };
    },
  },
);

describe('reviewPetitionHelper', () => {
  it('returns defaults when there is no form', () => {
    const result = runCompute(reviewPetitionHelper, {
      state: {
        form: {},
      },
    });
    expect(result).toEqual({
      hasIrsNoticeFormatted: 'No',
      irsNoticeDateFormatted: undefined,
      mailingDateFormatted: undefined,
      petitionPaymentStatusFormatted: 'Not Paid',
      receivedAtFormatted: undefined,
      shouldShowIrsNoticeDate: false,
    });
  });

  it('returns defaults when there is no form', () => {
    const result = runCompute(reviewPetitionHelper, {
      state: {
        form: {
          hasVerifiedIrsNotice: true,
          irsNoticeDate: '2020-01-05T03:30:45.007Z',
          mailingDate: '2020-01-05T03:30:45.007Z',
          petitionPaymentStatus: PAYMENT_STATUS.PAID,
          receivedAt: '2020-01-05T03:30:45.007Z',
        },
      },
    });

    expect(result).toEqual({
      hasIrsNoticeFormatted: 'Yes',
      irsNoticeDateFormatted: '01/04/2020',
      mailingDateFormatted: '01/04/2020',
      petitionPaymentStatusFormatted: 'Paid',
      receivedAtFormatted: '01/04/2020',
      shouldShowIrsNoticeDate: true,
    });
  });
});
