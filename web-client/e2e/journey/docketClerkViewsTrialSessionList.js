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
  });
};
