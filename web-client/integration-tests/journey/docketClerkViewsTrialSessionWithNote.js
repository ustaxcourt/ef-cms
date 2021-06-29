import { formattedTrialSessionDetails } from '../../src/presenter/computeds/formattedTrialSessionDetails';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

export const docketClerkViewsTrialSessionWithNote = test => {
  return it('Docket Clerk Views trial session with note', async () => {
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

    const foundCase = trialSessionFormatted.caseOrder.find(
      _case => _case.docketNumber == test.docketNumber,
    );

    expect(foundCase).toBeTruthy();

    expect(foundCase.calendarNotes).toEqual(test.calendarNote);
  });
};
