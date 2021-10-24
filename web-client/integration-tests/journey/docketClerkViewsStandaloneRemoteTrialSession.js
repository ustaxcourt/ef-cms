import { formattedTrialSessionDetails } from '../../src/presenter/computeds/formattedTrialSessionDetails';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

export const docketClerkViewsStandaloneRemoteTrialSession = (
  cerebralTest,
  status = 'Open',
) => {
  return it('Docket Clerk Views a new trial session', async () => {
    await cerebralTest.runSequence('gotoTrialSessionDetailSequence', {
      trialSessionId: cerebralTest.lastCreatedTrialSessionId,
    });

    const trialSessionFormatted = runCompute(
      withAppContextDecorator(formattedTrialSessionDetails),
      {
        state: cerebralTest.getState(),
      },
    );

    expect(trialSessionFormatted.computedStatus).toEqual(status);
    expect(trialSessionFormatted.startTime).toEqual('13:00');
    expect(trialSessionFormatted.sessionScope).toEqual('Standalone Remote');
  });
};
