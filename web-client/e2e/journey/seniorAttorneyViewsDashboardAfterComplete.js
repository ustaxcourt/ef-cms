import { runCompute } from 'cerebral/test';
import { formattedWorkQueue } from '../../src/presenter/computeds/formattedWorkQueue';

export default test => {
  return it('Senior Attorney views dashboard after they completed the stipulated decision work item', async () => {
    await test.runSequence('gotoDashboardSequence');
    expect(test.getState('currentPage')).toEqual('DashboardSeniorAttorney');
    expect(test.getState('workQueue').length).toBeGreaterThan(0);
    const workItem = runCompute(formattedWorkQueue, {
      state: test.getState(),
    }).find(item => item.workItemId === test.stipulatedDecisionWorkItemId);
    expect(workItem).toBeUndefined();

    // const sectionWorkItem = test
    //   .getState('sectionWorkQueue')
    //   .find(item => item.workItemId === test.stipulatedDecisionWorkItemId);
    // expect(sectionWorkItem).toBeUndefined();
  });
};
