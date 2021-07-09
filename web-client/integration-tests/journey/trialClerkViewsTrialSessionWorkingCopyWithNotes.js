import { runCompute } from 'cerebral/test';
import { trialSessionWorkingCopyHelper as trialSessionWorkingCopyHelperComputed } from '../../src/presenter/computeds/trialSessionWorkingCopyHelper';
import { withAppContextDecorator } from '../../src/withAppContext';

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

    let workingCopyHelper = runCompute(trialSessionWorkingCopyHelper, {
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
