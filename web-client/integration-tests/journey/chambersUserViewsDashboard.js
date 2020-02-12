import { runCompute } from 'cerebral/test';
import { trialSessionsSummaryHelper } from '../../src/presenter/computeds/trialSessionsSummaryHelper';
import { withAppContextDecorator } from '../../src/withAppContext';

export default (
  test,
  message = 'Test message',
  judgeUserId = 'dabbad00-18d0-43ec-bafb-654e83405416',
) => {
  return it('Chambers user views dashboard', async () => {
    await test.runSequence('gotoDashboardSequence');

    const trialSessionsSummaryHelperComputed = runCompute(
      withAppContextDecorator(trialSessionsSummaryHelper),
      {
        state: test.getState(),
      },
    );
    const workQueue = test.getState('workQueue');

    expect(test.getState('currentPage')).toEqual('DashboardChambers');
    expect(workQueue.length).toBeGreaterThan(0);
    expect(workQueue[0].messages[1].message).toEqual(message);
    expect(trialSessionsSummaryHelperComputed.judgeUserId).toEqual(judgeUserId);
  });
};
