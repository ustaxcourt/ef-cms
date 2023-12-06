import { reviewSavedPetitionHelper as reviewSavedPetitionHelperComputed } from '../../src/presenter/computeds/reviewSavedPetitionHelper';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../src/withAppContext';

export const petitionsClerkReviewsPaperCaseBeforeServing = (
  cerebralTest,
  expectedObject,
) => {
  const reviewSavedPetitionHelper = withAppContextDecorator(
    reviewSavedPetitionHelperComputed,
  );

  const updatedCaseCaption = 'Ada Lovelace is awesome';

  it('petitions clerk reviews paper case before serving', async () => {
    await cerebralTest.runSequence('submitPetitionFromPaperSequence');
    expect(cerebralTest.getState('alertError')).toBeUndefined();
    expect(cerebralTest.getState('validationErrors')).toEqual({});

    expect(cerebralTest.getState('currentPage')).toEqual('ReviewSavedPetition');

    const helper = runCompute(reviewSavedPetitionHelper, {
      state: cerebralTest.getState(),
    });

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
