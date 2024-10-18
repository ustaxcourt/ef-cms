import { runAction } from '@web-client/presenter/test.cerebral';
import { setTrialSessionsPageAction } from '@web-client/presenter/actions/TrialSession/setTrialSessionsPageAction';

describe('setTrialSessionsPageAction', () => {
  it('should set trial sessions', async () => {
    const trialSession = {
      dismissedAlertForNOTT: false,
      estimatedEndDate: null,
      isCalendared: true,
      judge: {
        name: 'Cohen',
        userId: 'dabbad04-18d0-43ec-bafb-654e83405416',
      },
      proceedingType: 'In Person',
      sessionScope: 'Location-based',
      sessionStatus: 'Open',
      sessionType: 'Special',
      startDate: '2019-12-02T05:00:00.000Z',
      startTime: '21:00',
      term: 'Fall',
      termYear: '2019',
      trialLocation: 'Denver, Colorado',
      trialSessionId: '0d943468-bc2e-4631-84e3-b084cf5b1fbb',
    };
    const result = await runAction(setTrialSessionsPageAction, {
      props: {
        trialSessions: [trialSession],
      },
      state: { trialSessionsPage: { trialSessions: [] } },
    });
    expect(result.state.trialSessionsPage.trialSessions).toEqual([
      trialSession,
    ]);
  });
});
