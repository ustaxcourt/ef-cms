import { runCompute } from 'cerebral/test';
import { trialSessionWorkingCopyHelper as trialSessionWorkingCopyHelperComputed } from '../../src/presenter/computeds/trialSessionWorkingCopyHelper';
import { withAppContextDecorator } from '../../src/withAppContext';

const trialSessionWorkingCopyHelper = withAppContextDecorator(
  trialSessionWorkingCopyHelperComputed,
);

export const trialClerkViewsTrialSessionWorkingCopyWithNotes = test => {
  return it('Trial Clerk views trial session working copy with notes', async () => {
    await test.runSequence('gotoTrialSessionWorkingCopySequence', {
      trialSessionId: test.trialSessionId,
    });
    expect(test.getState('currentPage')).toEqual('TrialSessionWorkingCopy');
    expect(test.getState('trialSessionWorkingCopy.trialSessionId')).toEqual(
      test.trialSessionId,
    );

    let workingCopyHelper = runCompute(trialSessionWorkingCopyHelper, {
      state: test.getState(),
    });

    const { docketNumber } = workingCopyHelper.formattedCases[0];

    expect(
      test.getState(`trialSessionWorkingCopy.userNotes.${docketNumber}.notes`),
    ).toEqual('this is a note added from the modal');
  });
};
