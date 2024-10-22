import { SESSION_STATUS_TYPES } from '@shared/business/entities/EntityConstants';

export const docketClerkVerifiesSessionIsNotClosed = cerebralTest => {
  return it('Docket Clerk verifies session is not closed', async () => {
    await cerebralTest.runSequence('gotoTrialSessionsSequence');

    expect(cerebralTest.getState('currentPage')).toEqual('TrialSessions');

    const { trialSessions } = cerebralTest.getState().trialSessionsPage;
    const foundSession = trialSessions.find(
      t => t.trialSessionId === cerebralTest.lastCreatedTrialSessionId,
    );
    expect(foundSession.sessionStatus).not.toEqual(SESSION_STATUS_TYPES.closed);
  });
};
