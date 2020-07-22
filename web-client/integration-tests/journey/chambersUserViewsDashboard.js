import { runCompute } from 'cerebral/test';
import { trialSessionsSummaryHelper } from '../../src/presenter/computeds/trialSessionsSummaryHelper';
import { withAppContextDecorator } from '../../src/withAppContext';

export const chambersUserViewsDashboard = test => {
  return it('Chambers user views dashboard', async () => {
    await test.runSequence('gotoDashboardSequence');

    const trialSessionsSummaryHelperComputed = runCompute(
      withAppContextDecorator(trialSessionsSummaryHelper),
      {
        state: test.getState(),
      },
    );
    const messages = test.getState('messages');

    expect(test.getState('currentPage')).toEqual('DashboardChambers');
    expect(messages.length).toBeGreaterThan(0);
    expect(messages[0].subject).toEqual(test.testMessageSubject);
    expect(trialSessionsSummaryHelperComputed.judgeUserId).toEqual(
      'dabbad00-18d0-43ec-bafb-654e83405416', //judgeArmen
    );
  });
};
