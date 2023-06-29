import { formattedTrialSessionDetails } from '../../src/presenter/computeds/formattedTrialSessionDetails';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../src/withAppContext';

export const petitionsClerkViewsOpenTrialSession = cerebralTest => {
  return it('petitions clerk views a open trial session', async () => {
    await cerebralTest.runSequence('gotoTrialSessionDetailSequence', {
      trialSessionId: cerebralTest.trialSessionId,
    });

    const trialSessionFormatted = runCompute(
      withAppContextDecorator(formattedTrialSessionDetails),
      {
        state: cerebralTest.getState(),
      },
    );

    expect(trialSessionFormatted.sessionStatus).toEqual('Open');
  });
};
