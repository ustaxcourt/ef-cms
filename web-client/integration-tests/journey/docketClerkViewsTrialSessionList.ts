import { find } from 'lodash';

export const docketClerkViewsTrialSessionList = (
  cerebralTest,
  overrides = {},
) => {
  return it('Docket clerk views trial session list', async () => {
    await cerebralTest.runSequence('gotoTrialSessionsSequence');
    expect(cerebralTest.getState('currentPage')).toEqual('TrialSessions');

    const { trialSessions } = cerebralTest.getState().trialSessionsPage;

    expect(trialSessions.length).toBeGreaterThan(0);

    const trialSession = find(trialSessions, {
      trialSessionId: cerebralTest.lastCreatedTrialSessionId,
    });

    expect(trialSession).toBeDefined();

    if (overrides.expectSwingSession) {
      expect(trialSession.swingSession).toEqual(true);
    }

    cerebralTest.trialSessionId = trialSession && trialSession.trialSessionId;
    if (cerebralTest.createdTrialSessions) {
      cerebralTest.createdTrialSessions.push(cerebralTest.trialSessionId);
    }
  });
};
