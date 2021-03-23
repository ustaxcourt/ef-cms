import { find } from 'lodash';
import { formattedTrialSessions as formattedTrialSessionsComputed } from '../../src/presenter/computeds/formattedTrialSessions';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const formattedTrialSessions = withAppContextDecorator(
  formattedTrialSessionsComputed,
);

export const docketClerkViewsTrialSessionList = test => {
  return it('Docket clerk views trial session list', async () => {
    await test.runSequence('gotoTrialSessionsSequence');
    expect(test.getState('currentPage')).toEqual('TrialSessions');

    const formatted = runCompute(formattedTrialSessions, {
      state: test.getState(),
    });
    expect(formatted.formattedSessions.length).toBeGreaterThan(0);

    const trialSession = find(formatted.sessionsByTerm, {
      trialSessionId: test.lastCreatedTrialSessionId,
    });

    expect(trialSession).toBeDefined();

    test.trialSessionId = trialSession && trialSession.trialSessionId;
    if (test.createdTrialSessions) {
      test.createdTrialSessions.push(test.trialSessionId);
    }
  });
};
