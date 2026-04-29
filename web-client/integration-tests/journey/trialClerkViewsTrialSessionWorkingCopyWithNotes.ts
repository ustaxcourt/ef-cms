import { runCompute } from '@web-client/presenter/test.cerebral';
import { trialSessionWorkingCopyHelper as trialSessionWorkingCopyHelperComputed } from '@web-client/presenter/computeds/trialSessionWorkingCopyHelper';
import { withAppContextDecorator } from '@web-client/withAppContext';

const trialSessionWorkingCopyHelper = withAppContextDecorator(
  trialSessionWorkingCopyHelperComputed,
);

export const trialClerkViewsTrialSessionWorkingCopyWithNotes = cerebralTest => {
  return it('Trial Clerk views trial session working copy with notes', async () => {
    await cerebralTest.runSequence('gotoTrialSessionWorkingCopySequence', {
      trialSessionId: cerebralTest.trialSessionId,
    });
    expect(cerebralTest.getState('currentPage')).toEqual(
      'TrialSessionWorkingCopy',
    );
    expect(
      cerebralTest.getState('trialSessionWorkingCopy.trialSessionId'),
    ).toEqual(cerebralTest.trialSessionId);

    const workingCopyHelper = runCompute(trialSessionWorkingCopyHelper, {
      state: cerebralTest.getState(),
    });

    const { docketNumber } = workingCopyHelper.formattedCases[0];

    expect(
      cerebralTest.getState(
        `trialSessionWorkingCopy.userNotes.${docketNumber}.notes`,
      ),
    ).toEqual('this is a note added from the modal');
  });
};
