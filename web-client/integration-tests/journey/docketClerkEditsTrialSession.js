import { formattedTrialSessionDetails as formattedTrialSessionDetailsComputed } from '../../src/presenter/computeds/formattedTrialSessionDetails';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const formattedTrialSessionDetails = withAppContextDecorator(
  formattedTrialSessionDetailsComputed,
);

export const docketClerkEditsTrialSession = test => {
  return it('Docket clerk edits trial session', async () => {
    await test.runSequence('gotoEditTrialSessionSequence', {
      trialSessionId: test.trialSessionId,
    });
    expect(test.getState('currentPage')).toEqual('EditTrialSession');

    await test.runSequence('updateTrialSessionFormDataSequence', {
      key: 'notes',
      value: 'hello',
    });

    await test.runSequence('updateTrialSessionSequence');

    expect(test.getState('currentPage')).toEqual('TrialSessionDetail');

    const formatted = runCompute(formattedTrialSessionDetails, {
      state: test.getState(),
    });

    expect(formatted.notes).toEqual('hello');
  });
};
