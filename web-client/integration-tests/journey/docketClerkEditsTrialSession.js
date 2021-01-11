import { formattedTrialSessionDetails as formattedTrialSessionDetailsComputed } from '../../src/presenter/computeds/formattedTrialSessionDetails';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const formattedTrialSessionDetails = withAppContextDecorator(
  formattedTrialSessionDetailsComputed,
);

export const docketClerkEditsTrialSession = (test, overrides = {}) => {
  return it('Docket clerk edits trial session', async () => {
    await test.runSequence('gotoEditTrialSessionSequence', {
      trialSessionId: test.trialSessionId,
    });
    expect(test.getState('currentPage')).toEqual('EditTrialSession');

    const mockNote = 'hello';
    await test.runSequence('updateTrialSessionFormDataSequence', {
      key: overrides.fieldToUpdate || 'notes',
      value: overrides.valueToUpdate || mockNote,
    });

    await test.runSequence('updateTrialSessionSequence');

    expect(test.getState('validationErrors')).toEqual({});

    expect(test.getState('currentPage')).toEqual('TrialSessionDetail');

    const formatted = runCompute(formattedTrialSessionDetails, {
      state: test.getState(),
    });

    const expectedUpdatedValue =
      formatted[overrides.fieldToUpdate] || formatted.notes;
    const receivedUpdatedValue = overrides.valueToUpdate || mockNote;

    expect(expectedUpdatedValue).toEqual(receivedUpdatedValue);
  });
};
