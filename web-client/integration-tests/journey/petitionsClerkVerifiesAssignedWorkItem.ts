import { getPetitionWorkItemForCase } from '../helpers';

export const petitionsClerkVerifiesAssignedWorkItem = (
  cerebralTest,
  createdCases,
) => {
  return it('Petitions clerk verifies assignment of work item', async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: createdCases[0].docketNumber,
    });

    const { workItemId } = getPetitionWorkItemForCase(
      cerebralTest.getState('caseDetail'),
    );

    await cerebralTest.runSequence('gotoWorkQueueSequence');
    expect(cerebralTest.getState('currentPage')).toEqual('WorkQueue');
    const workItem = cerebralTest
      .getState('workQueue')
      .find(workItemInQueue => workItemInQueue.workItemId === workItemId);
    expect(workItem).toBeDefined();
  });
};
