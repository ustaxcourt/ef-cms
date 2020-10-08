import { formattedTrialSessions as formattedTrialSessionsComputed } from '../../src/presenter/computeds/formattedTrialSessions';
import { runCompute } from 'cerebral/test';
import { trialSessionsHelper as trialSessionsHelperComputed } from '../../src/presenter/computeds/trialSessionsHelper';
import { withAppContextDecorator } from '../../src/withAppContext';

const formattedTrialSessions = withAppContextDecorator(
  formattedTrialSessionsComputed,
);

export const docketClerkViewsTrialSessionsTab = (test, overrides = {}) => {
  const status = overrides.tab || 'Open';
  return it(`Docket clerk views ${status} Trial Sessions tab`, async () => {
    await test.runSequence('gotoTrialSessionsSequence', {
      query: {
        status,
      },
    });

    expect(test.getState('currentPage')).toEqual('TrialSessions');
    expect(test.getState('screenMetadata.trialSessionFilters.status')).toEqual(
      status,
    );

    const formatted = runCompute(formattedTrialSessions, {
      state: test.getState(),
    });

    const trialSessionsHelper = withAppContextDecorator(
      trialSessionsHelperComputed,
    );

    const helper = runCompute(trialSessionsHelper, {
      state: test.getState(),
    });

    const legacyJudge = helper.trialSessionJudges.find(
      judge => judge.role === 'legacyJudge',
    );

    if (status === 'Closed' || status === 'All') {
      expect(legacyJudge).toBeTruthy();
    } else {
      expect(legacyJudge).toBeFalsy();
    }

    const filteredSessions = formatted.filteredTrialSessions[status];

    let foundSession;
    filteredSessions.some(trialSession => {
      trialSession.sessions.some(session => {
        if (session.trialSessionId === test.trialSessionId) {
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
