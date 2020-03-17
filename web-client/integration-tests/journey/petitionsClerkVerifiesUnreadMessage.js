import { getPetitionWorkItemForCase } from '../helpers';

export default (test, createdCases) => {
  return it('Petitions clerk verifies work item is unread', async () => {
    const { workItemId } = getPetitionWorkItemForCase(createdCases[0]);

    await test.runSequence('gotoMessagesSequence');
    expect(test.getState('currentPage')).toEqual('Messages');
    const workItem = test
      .getState('workQueue')
      .find(workItem => workItem.workItemId === workItemId);
    expect(workItem.isRead).toBeFalsy();
  });
};
