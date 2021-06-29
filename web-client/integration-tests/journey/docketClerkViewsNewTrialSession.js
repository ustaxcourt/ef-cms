import { formattedTrialSessionDetails } from '../../src/presenter/computeds/formattedTrialSessionDetails';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

export const docketClerkViewsNewTrialSession = (
  test,
  checkCase,
  calendarNote,
) => {
  return it('Docket Clerk Views a new trial session', async () => {
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

    if (checkCase) {
      const foundCase = trialSessionFormatted.caseOrder.find(
        _case => _case.docketNumber == test.docketNumber,
      );

      expect(foundCase).toBeTruthy();

      if (calendarNote) {
        expect(foundCase.calendarNotes).toEqual(calendarNote);
      }
    }
  });
};
