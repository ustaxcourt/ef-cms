import { refreshElasticsearchIndex } from '../helpers';

export const petitionsClerkReviewsPetitionAndSavesForLater = cerebralTest => {
  return it('Petitions Clerk reviews petition and saves for later', async () => {
    await refreshElasticsearchIndex();

    await cerebralTest.runSequence('gotoWorkQueueSequence');
    expect(cerebralTest.getState('currentPage')).toEqual('WorkQueue');
    await cerebralTest.runSequence('chooseWorkQueueSequence', {
      box: 'inbox',
      queue: 'section',
    });

    const workQueueToDisplay = cerebralTest.getState('workQueueToDisplay');

    expect(workQueueToDisplay.queue).toEqual('section');
    expect(workQueueToDisplay.box).toEqual('inbox');

    const inboxQueue = cerebralTest.getState('workQueue');
    const inboxWorkItem = inboxQueue.find(
      workItem => workItem.docketNumber === cerebralTest.docketNumber,
    );

    expect(inboxWorkItem).toBeTruthy();

    await cerebralTest.runSequence('gotoPetitionQcSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'hasVerifiedIrsNotice',
      value: false,
    });

    await cerebralTest.runSequence('saveSavedCaseForLaterSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({});

    expect(cerebralTest.getState('currentPage')).toEqual('ReviewSavedPetition');

    await cerebralTest.runSequence('leaveCaseForLaterServiceSequence', {});

    expect(cerebralTest.getState('currentPage')).toEqual('WorkQueue');
  });
};
