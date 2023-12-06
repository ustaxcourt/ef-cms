import { formattedTrialSessions as formattedTrialSessionsComputed } from '../../src/presenter/computeds/formattedTrialSessions';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../src/withAppContext';

const formattedTrialSessions = withAppContextDecorator(
  formattedTrialSessionsComputed,
);

const status = 'Closed';

export const docketClerkClosesStandaloneRemoteTrialSession = cerebralTest => {
  return it('Docket Clerk closes the trial session', async () => {
    await cerebralTest.runSequence('gotoTrialSessionDetailSequence', {
      trialSessionId: cerebralTest.lastCreatedTrialSessionId,
    });
    expect(cerebralTest.getState('currentPage')).toEqual('TrialSessionDetail');

    await cerebralTest.runSequence('closeTrialSessionSequence');

    const formatted = runCompute(formattedTrialSessions, {
      state: cerebralTest.getState(),
    });

    const filteredSessions = formatted.filteredTrialSessions[status];

    let foundSession;
    filteredSessions.some(trialSession => {
      trialSession.sessions.some(session => {
        if (session.trialSessionId === cerebralTest.lastCreatedTrialSessionId) {
          foundSession = session;
          return true;
        }
      });
      if (foundSession) {
        return true;
      }
    });

    expect(foundSession).toBeTruthy();
  });
};
