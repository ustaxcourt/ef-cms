import { formattedTrialSessions as formattedTrialSessionsComputed } from '../../src/presenter/computeds/formattedTrialSessions';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../src/withAppContext';

const formattedTrialSessions = withAppContextDecorator(
  formattedTrialSessionsComputed,
);

const status = 'Closed';

export const docketClerkVerifiesSessionIsNotClosed = cerebralTest => {
  return it('Docket Clerk verifies session is not closed', async () => {
    await cerebralTest.runSequence('gotoTrialSessionsSequence', {
      query: {
        status,
      },
    });

    expect(cerebralTest.getState('currentPage')).toEqual('TrialSessions');
    expect(
      cerebralTest.getState('screenMetadata.trialSessionFilters.status'),
    ).toEqual(status);

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

    expect(foundSession).toBeFalsy();
  });
};
