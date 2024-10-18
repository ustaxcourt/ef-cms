import { SESSION_STATUS_TYPES } from '@shared/business/entities/EntityConstants';

export const docketClerkClosesStandaloneRemoteTrialSession = cerebralTest => {
  return it('Docket Clerk closes the trial session', async () => {
    await cerebralTest.runSequence('gotoTrialSessionDetailSequence', {
      trialSessionId: cerebralTest.lastCreatedTrialSessionId,
    });
    expect(cerebralTest.getState('currentPage')).toEqual('TrialSessionDetail');

    await cerebralTest.runSequence('closeTrialSessionSequence');

    const { trialSessions } = cerebralTest.getState().trialSessionsPage;
    expect(trialSessions.length).toBeGreaterThan(0);

    const foundSession = trialSessions.find(
      t => t.trialSessionId === cerebralTest.lastCreatedTrialSessionId,
    );
    expect(foundSession).toBeTruthy();
    expect(foundSession.sessionStatus).toEqual(SESSION_STATUS_TYPES.closed);
  });
};
