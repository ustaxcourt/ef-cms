import { find } from 'lodash';
import { formattedTrialSessions as formattedTrialSessionsComputed } from '../../src/presenter/computeds/formattedTrialSessions';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const formattedTrialSessions = withAppContextDecorator(
  formattedTrialSessionsComputed,
);

export default (test, overrides = {}) => {
  return it('Docket clerk views trial session list', async () => {
    await test.runSequence('gotoTrialSessionsSequence');
    expect(test.getState('currentPage')).toEqual('TrialSessions');

    const formatted = runCompute(formattedTrialSessions, {
      state: test.getState(),
    });
    expect(formatted.formattedSessions.length).toBeGreaterThan(0);

    const trialSession = find(formatted.sessionsByTerm, {
      sessionType: overrides.sessionType || 'Hybrid',
      status: 'Upcoming',
      trialLocation: overrides.trialLocation || 'Seattle, Washington',
    });
    test.trialSessionId = trialSession && trialSession.trialSessionId;
  });
};
