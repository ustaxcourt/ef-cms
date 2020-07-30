export const petitionsClerkReviewsPetitionAndSavesForLater = test => {
  return it('Petitions Clerk reviews petition and saves for later', async () => {
    await test.runSequence('gotoMessagesSequence');
    expect(test.getState('currentPage')).toEqual('Messages');
    await test.runSequence('chooseWorkQueueSequence', {
      box: 'inbox',
      queue: 'section',
      workQueueIsInternal: false,
    });

    const workQueueToDisplay = test.getState('workQueueToDisplay');

    expect(workQueueToDisplay.workQueueIsInternal).toBeFalsy();
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

    await test.runSequence('saveSavedCaseForLaterSequence', {});

    expect(test.getState('currentPage')).toEqual('ReviewSavedPetition');

    await test.runSequence('leaveCaseForLaterServiceSequence', {});

    expect(test.getState('currentPage')).toEqual('Messages');
  });
};
