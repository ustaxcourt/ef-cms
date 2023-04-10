import { runCompute } from 'cerebral/test';
import { trialSessionsSummaryHelper } from '../../src/presenter/computeds/trialSessionsSummaryHelper';
import { withAppContextDecorator } from '../../src/withAppContext';

export const chambersUserViewsDashboard = cerebralTest => {
  return it('Chambers user views dashboard', async () => {
    await cerebralTest.runSequence('gotoDashboardSequence');

    const trialSessionsSummaryHelperComputed = runCompute(
      withAppContextDecorator(trialSessionsSummaryHelper),
      {
        state: cerebralTest.getState(),
      },
    );
    const messages = cerebralTest.getState('messages');

    expect(cerebralTest.getState('currentPage')).toEqual('DashboardChambers');
    expect(messages.length).toBeGreaterThan(0);
    expect(messages).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          subject: cerebralTest.testMessageSubject,
        }),
      ]),
    );
    expect(trialSessionsSummaryHelperComputed.judgeUserId).toEqual(
      'dabbad00-18d0-43ec-bafb-654e83405416', //judgeColvin
    );
  });
};
