import { CASE_STATUS_TYPES } from '../../../shared/src/business/entities/EntityConstants';

export const petitionsClerkViewsWorkQueue = test => {
  return it('Petitions clerk views work queue', async () => {
    await test.runSequence('gotoWorkQueueSequence');
    expect(test.getState('currentPage')).toEqual('WorkQueue');
    expect(test.getState('workQueue').length).toBeGreaterThanOrEqual(0);
    expect(test.getState('users').length).toBeGreaterThan(0);
    await test.runSequence('chooseWorkQueueSequence', {
      box: 'inbox',
      queue: 'section',
    });
    const workItem = test
      .getState('workQueue')
      .find(
        workItemInQueue =>
          workItemInQueue.docketNumber === test.docketNumber &&
          workItemInQueue.docketEntry.documentType === 'Petition',
      );
    expect(workItem).toBeDefined();
    expect(workItem.caseStatus).toEqual(CASE_STATUS_TYPES.new);
    test.docketEntryId = workItem.docketEntry.docketEntryId;
    test.workItemId = workItem.workItemId;
  });
};
