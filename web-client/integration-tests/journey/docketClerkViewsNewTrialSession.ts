import { formattedTrialSessionDetails } from '../../src/presenter/computeds/formattedTrialSessionDetails';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../src/withAppContext';

export const docketClerkViewsNewTrialSession = (
  cerebralTest,
  checkCase?,
  calendarNote?,
) => {
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

    expect(trialSessionFormatted.sessionStatus).toEqual('New');

    if (checkCase) {
      const foundCase = trialSessionFormatted.caseOrder.find(
        _case => _case.docketNumber == cerebralTest.docketNumber,
      );

      expect(foundCase).toBeTruthy();

      if (calendarNote) {
        expect(foundCase.calendarNotes).toEqual(calendarNote);
      }
    }
  });
};
