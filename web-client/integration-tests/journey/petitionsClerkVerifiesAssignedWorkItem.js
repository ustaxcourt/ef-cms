import { getPetitionWorkItemForCase } from '../helpers';

export const petitionsClerkVerifiesAssignedWorkItem = (test, createdCases) => {
  return it('Petitions clerk verifies assignment of work item', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: createdCases[0].docketNumber,
    });

    const { workItemId } = getPetitionWorkItemForCase(
      test.getState('caseDetail'),
    );

    await test.runSequence('gotoWorkQueueSequence');
    expect(test.getState('currentPage')).toEqual('WorkQueue');
    const workItem = test
      .getState('workQueue')
      .find(workItemInQueue => workItemInQueue.workItemId === workItemId);
    expect(workItem).toBeDefined();
  });
};
