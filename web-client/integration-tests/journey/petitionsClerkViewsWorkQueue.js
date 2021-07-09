import { CASE_STATUS_TYPES } from '../../../shared/src/business/entities/EntityConstants';

export const petitionsClerkViewsWorkQueue = cerebralTest => {
  return it('Petitions clerk views work queue', async () => {
    await cerebralTest.runSequence('gotoWorkQueueSequence');
    expect(cerebralTest.getState('currentPage')).toEqual('WorkQueue');
    expect(cerebralTest.getState('workQueue').length).toBeGreaterThanOrEqual(0);
    expect(cerebralTest.getState('users').length).toBeGreaterThan(0);
    await cerebralTest.runSequence('chooseWorkQueueSequence', {
      box: 'inbox',
      queue: 'section',
    });
    const workItem = cerebralTest
      .getState('workQueue')
      .find(
        workItemInQueue =>
          workItemInQueue.docketNumber === cerebralTest.docketNumber &&
          workItemInQueue.docketEntry.documentType === 'Petition',
      );
    expect(workItem).toBeDefined();
    expect(workItem.caseStatus).toEqual(CASE_STATUS_TYPES.new);
    cerebralTest.docketEntryId = workItem.docketEntry.docketEntryId;
    cerebralTest.workItemId = workItem.workItemId;
  });
};
