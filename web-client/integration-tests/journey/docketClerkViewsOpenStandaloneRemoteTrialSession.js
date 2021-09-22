import { formattedTrialSessionDetails } from '../../src/presenter/computeds/formattedTrialSessionDetails';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

export const docketClerkViewsOpenStandaloneRemoteTrialSession =
  cerebralTest => {
    return it('Docket Clerk Views a new trial session', async () => {
      await cerebralTest.runSequence('gotoTrialSessionDetailSequence', {
        trialSessionId: cerebralTest.trialSessionId,
      });

      const trialSessionFormatted = runCompute(
        withAppContextDecorator(formattedTrialSessionDetails),
        {
          state: cerebralTest.getState(),
        },
      );

      expect(trialSessionFormatted.computedStatus).toEqual('Open');
      expect(trialSessionFormatted.startTime).toEqual('1:00');
    });
  };
