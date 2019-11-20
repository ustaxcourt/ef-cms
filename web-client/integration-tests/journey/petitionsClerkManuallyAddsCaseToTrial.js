import { addToTrialSessionModalHelper as addToTrialSessionModalHelperComputed } from '../../src/presenter/computeds/addToTrialSessionModalHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const addToTrialSessionModalHelper = withAppContextDecorator(
  addToTrialSessionModalHelperComputed,
);

export default test => {
  return it('Petitions clerk manually adds a case to an uncalendared trial session', async () => {
    const caseToAdd =
      test.casesReadyForTrial[test.casesReadyForTrial.length - 1];

    test.manuallyAddedTrialCaseDocketNumber = caseToAdd.docketNumber;

    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: caseToAdd.docketNumber,
    });

    await test.runSequence('openAddToTrialModalSequence');

    let modalHelper = await runCompute(addToTrialSessionModalHelper, {
      state: test.getState(),
    });

    expect(modalHelper.showSessionNotSetAlert).toEqual(false);

    await test.runSequence('updateModalValueSequence', {
      key: 'showAllLocations',
      value: true,
    });

    await test.runSequence('updateModalValueSequence', {
      key: 'trialSessionId',
      value: test.trialSessionId,
    });

    // Because the selected trial session is not yet calendared, we should show
    // the alert in the UI stating so.
    modalHelper = await runCompute(addToTrialSessionModalHelper, {
      state: test.getState(),
    });

    expect(modalHelper.showSessionNotSetAlert).toEqual(true);

    await test.runSequence('addCaseToTrialSessionSequence');
  });
};
