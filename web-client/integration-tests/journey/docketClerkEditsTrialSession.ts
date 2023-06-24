import { formattedTrialSessionDetails as formattedTrialSessionDetailsComputed } from '../../src/presenter/computeds/formattedTrialSessionDetails';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { waitForExpectedItem, waitForLoadingComponentToHide } from '../helpers';
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

    await waitForLoadingComponentToHide({ cerebralTest });
    await waitForExpectedItem({
      cerebralTest,
      currentItem: 'currentPage',
      expectedItem: 'PrintPaperTrialNotices',
    });
    expect(cerebralTest.getState('currentPage')).toEqual('TrialSessionDetail');

    const formatted = runCompute(formattedTrialSessionDetails, {
      state: cerebralTest.getState(),
    });

    const receivedUpdatedValue =
      formatted[overrides.fieldToUpdate] || formatted.notes;
    const expectedUpdatedValue = overrides.valueToUpdate || mockNote;

    expect(receivedUpdatedValue).toEqual(expectedUpdatedValue);
  });
};
