import { formattedTrialSessionDetails as formattedTrialSessionDetailsComputed } from '../../src/presenter/computeds/formattedTrialSessionDetails';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const formattedTrialSessionDetails = withAppContextDecorator(
  formattedTrialSessionDetailsComputed,
);

export const docketClerkEditsTrialSession = (cerebralTest, overrides = {}) => {
  return it('Docket clerk edits trial session', async () => {
    await cerebralTest.runSequence('gotoEditTrialSessionSequence', {
      trialSessionId: cerebralTest.trialSessionId,
    });
    expect(cerebralTest.getState('currentPage')).toEqual('EditTrialSession');

    const mockNote = 'hello';
    await cerebralTest.runSequence('updateTrialSessionFormDataSequence', {
      key: overrides.fieldToUpdate || 'notes',
      value: overrides.valueToUpdate || mockNote,
    });

    await cerebralTest.runSequence('updateTrialSessionSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({});

    expect(cerebralTest.getState('currentPage')).toEqual('TrialSessionDetail');

    const formatted = runCompute(formattedTrialSessionDetails, {
      state: cerebralTest.getState(),
    });

    const expectedUpdatedValue =
      formatted[overrides.fieldToUpdate] || formatted.notes;
    const receivedUpdatedValue = overrides.valueToUpdate || mockNote;

    expect(expectedUpdatedValue).toEqual(receivedUpdatedValue);
  });
};
