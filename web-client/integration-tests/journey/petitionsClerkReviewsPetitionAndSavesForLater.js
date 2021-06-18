import { refreshElasticsearchIndex } from '../helpers';

export const petitionsClerkReviewsPetitionAndSavesForLater = test => {
  return it('Petitions Clerk reviews petition and saves for later', async () => {
    await refreshElasticsearchIndex();

    await test.runSequence('gotoWorkQueueSequence');
    expect(test.getState('currentPage')).toEqual('WorkQueue');
    await test.runSequence('chooseWorkQueueSequence', {
      box: 'inbox',
      queue: 'section',
    });

    const workQueueToDisplay = test.getState('workQueueToDisplay');

    expect(workQueueToDisplay.queue).toEqual('section');
    expect(workQueueToDisplay.box).toEqual('inbox');

    const inboxQueue = test.getState('workQueue');
    const inboxWorkItem = inboxQueue.find(
      workItem => workItem.docketNumber === test.docketNumber,
    );

    expect(inboxWorkItem).toBeTruthy();

    await test.runSequence('gotoPetitionQcSequence', {
      docketNumber: test.docketNumber,
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'hasVerifiedIrsNotice',
      value: false,
    });

    await test.runSequence('saveSavedCaseForLaterSequence');

    expect(test.getState('validationErrors')).toEqual({});

    expect(test.getState('currentPage')).toEqual('ReviewSavedPetition');

    await test.runSequence('leaveCaseForLaterServiceSequence', {});

    expect(test.getState('currentPage')).toEqual('WorkQueue');
  });
};
