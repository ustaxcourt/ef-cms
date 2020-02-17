import { formattedTrialSessionDetails } from '../../src/presenter/computeds/formattedTrialSessionDetails';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

export default test => {
  return it('Docket Clerk Views A New Trial Session', async () => {
    await test.runSequence('gotoTrialSessionDetailSequence', {
      trialSessionId: test.trialSessionId,
    });

    const trialSessionFormatted = runCompute(
      withAppContextDecorator(formattedTrialSessionDetails),
      {
        state: test.getState(),
      },
    );

    expect(trialSessionFormatted.computedStatus).toEqual('New');
  });
};
