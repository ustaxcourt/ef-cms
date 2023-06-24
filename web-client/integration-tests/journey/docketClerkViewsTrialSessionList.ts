import { find } from 'lodash';
import { formattedTrialSessions as formattedTrialSessionsComputed } from '../../src/presenter/computeds/formattedTrialSessions';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../src/withAppContext';

const formattedTrialSessions = withAppContextDecorator(
  formattedTrialSessionsComputed,
);

export const docketClerkViewsTrialSessionList = (
  cerebralTest,
  overrides = {},
) => {
  return it('Docket clerk views trial session list', async () => {
    await cerebralTest.runSequence('gotoTrialSessionsSequence');
    expect(cerebralTest.getState('currentPage')).toEqual('TrialSessions');

    const formatted = runCompute(formattedTrialSessions, {
      state: cerebralTest.getState(),
    });
    expect(formatted.formattedSessions.length).toBeGreaterThan(0);

    const trialSession = find(formatted.sessionsByTerm, {
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
