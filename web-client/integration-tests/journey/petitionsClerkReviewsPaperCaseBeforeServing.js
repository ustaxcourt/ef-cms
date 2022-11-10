import { PAYMENT_STATUS } from '../../../shared/src/business/entities/EntityConstants';
import { reviewSavedPetitionHelper as reviewSavedPetitionHelperComputed } from '../../src/presenter/computeds/reviewSavedPetitionHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const reviewSavedPetitionHelper = withAppContextDecorator(
  reviewSavedPetitionHelperComputed,
);

export const petitionsClerkReviewsPaperCaseBeforeServing = (
  cerebralTest,
  { paymentStatus = PAYMENT_STATUS.WAIVED } = {},
) => {
  const updatedCaseCaption = 'Ada Lovelace is awesome';

  it('petitions clerk reviews paper case before serving', async () => {
    await cerebralTest.runSequence('submitPetitionFromPaperSequence');
    expect(cerebralTest.getState('alertError')).toBeUndefined();
    expect(cerebralTest.getState('validationErrors')).toEqual({});

    expect(cerebralTest.getState('currentPage')).toEqual('ReviewSavedPetition');

    const helper = runCompute(reviewSavedPetitionHelper, {
      state: cerebralTest.getState(),
    });

    const expectedPaymentStatus =
      paymentStatus === PAYMENT_STATUS.UNPAID
        ? PAYMENT_STATUS.UNPAID
        : 'Waived 05/05/05';

    let expectedObject = {
      hasIrsNoticeFormatted: 'No',
      ordersAndNoticesInDraft: ['Order Designating Place of Trial'], // UPDATE THIS
      ordersAndNoticesNeeded: ['Order for Ratification of Petition'],
      petitionPaymentStatusFormatted: expectedPaymentStatus,
      receivedAtFormatted: '01/01/01',
      shouldShowIrsNoticeDate: false,
    };

    expect(helper).toMatchObject(expectedObject);

    expect(cerebralTest.getState('caseDetail')).toMatchObject({
      caseCaption: updatedCaseCaption,
      isPaper: true,
    });

    cerebralTest.docketNumber = cerebralTest.getState(
      'caseDetail.docketNumber',
    );
  });
};
