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
      mailingDateFormatted: undefined,
      ownershipDisclosureFile: undefined,
      petitionFile: undefined,
      petitionPaymentStatusFormatted: 'Not paid',
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
      petitionPaymentStatusFormatted: 'Paid',
      receivedAtFormatted: '01/04/2020',
      requestForPlaceOfTrialFile: {
        documentType:
          INITIAL_DOCUMENT_TYPES.requestForPlaceOfTrial.documentType,
      },
      shouldShowIrsNoticeDate: true,
      stinFile: { documentType: INITIAL_DOCUMENT_TYPES.stin.documentType },
    });
  });
});
