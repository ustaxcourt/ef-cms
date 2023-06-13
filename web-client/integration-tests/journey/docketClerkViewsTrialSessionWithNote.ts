import { formattedTrialSessionDetails } from '../../src/presenter/computeds/formattedTrialSessionDetails';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../src/withAppContext';

export const docketClerkViewsTrialSessionWithNote = cerebralTest => {
  return it('Docket Clerk Views trial session with note', async () => {
    await cerebralTest.runSequence('gotoTrialSessionDetailSequence', {
      trialSessionId: cerebralTest.trialSessionId,
    });

    const trialSessionFormatted = runCompute(
      withAppContextDecorator(formattedTrialSessionDetails),
      {
        state: cerebralTest.getState(),
      },
    );

    expect(trialSessionFormatted.sessionStatus).toEqual('New');

    const foundCase = trialSessionFormatted.caseOrder.find(
      _case => _case.docketNumber == cerebralTest.docketNumber,
    );

    expect(foundCase).toBeTruthy();

    expect(foundCase.calendarNotes).toEqual(cerebralTest.calendarNote);
  });
};
