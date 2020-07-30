import { getPetitionWorkItemForCase } from '../helpers';

export const petitionsClerkVerifiesAssignedWorkItem = (test, createdCases) => {
  return it('Petitions clerk verifies assignment of work item', async () => {
    const { workItemId } = getPetitionWorkItemForCase(createdCases[0]);

    await test.runSequence('gotoWorkQueueSequence');
    expect(test.getState('currentPage')).toEqual('WorkQueue');
    const workItem = test
      .getState('workQueue')
      .find(workItem => workItem.workItemId === workItemId);
    expect(workItem).toBeDefined();
  });
};
