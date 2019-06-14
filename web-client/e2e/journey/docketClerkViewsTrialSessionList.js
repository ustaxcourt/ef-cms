import { find } from 'lodash';
import { formattedTrialSessions as formattedTrialSessionsComputed } from '../../src/presenter/computeds/formattedTrialSessions';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const formattedTrialSessions = withAppContextDecorator(
  formattedTrialSessionsComputed,
);

export default test => {
  return it('Docket clerk views trial session list', async () => {
    await test.runSequence('gotoTrialSessionsSequence');
    expect(test.getState('currentPage')).toEqual('TrialSessions');

    const formatted = runCompute(formattedTrialSessions, {
      state: test.getState(),
    });
    expect(formatted.formattedSessions.length).toBeGreaterThan(0);

    const trialSession = find(formatted.sessionsByTerm, {
      judge: 'Judge Cohen',
      sessionType: 'Hybrid',
      startDate: '2025-12-12T05:00:00.000Z',
      status: 'Upcoming',
      term: 'Fall',
      termYear: '2025',
      trialLocation: 'Seattle, Washington',
    });
    test.trialSessionId = trialSession && trialSession.trialSessionId;
  });
};
