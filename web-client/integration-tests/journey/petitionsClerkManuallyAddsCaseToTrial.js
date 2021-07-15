import { addToTrialSessionModalHelper as addToTrialSessionModalHelperComputed } from '../../src/presenter/computeds/addToTrialSessionModalHelper';
import { runCompute } from 'cerebral/test';
import { wait } from '../helpers';
import { withAppContextDecorator } from '../../src/withAppContext';

const addToTrialSessionModalHelper = withAppContextDecorator(
  addToTrialSessionModalHelperComputed,
);

export const petitionsClerkManuallyAddsCaseToTrial = cerebralTest => {
  return it('Petitions clerk manually adds a case to an uncalendared trial session', async () => {
    const caseToAdd =
      cerebralTest.casesReadyForTrial[
        cerebralTest.casesReadyForTrial.length - 1
      ];

    cerebralTest.manuallyAddedTrialCaseDocketNumber = caseToAdd.docketNumber;

    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: caseToAdd.docketNumber,
    });

    await cerebralTest.runSequence('openAddToTrialModalSequence');

    let modalHelper = await runCompute(addToTrialSessionModalHelper, {
      state: cerebralTest.getState(),
    });

    expect(modalHelper.showSessionNotSetAlert).toEqual(false);

    await cerebralTest.runSequence('updateModalValueSequence', {
      key: 'showAllLocations',
      value: true,
    });

    await cerebralTest.runSequence('updateModalValueSequence', {
      key: 'trialSessionId',
      value: cerebralTest.trialSessionId,
    });

    // Because the selected trial session is not yet calendared, we should show
    // the alert in the UI stating so.
    modalHelper = await runCompute(addToTrialSessionModalHelper, {
      state: cerebralTest.getState(),
    });

    expect(modalHelper.showSessionNotSetAlert).toEqual(true);

    await cerebralTest.runSequence('addCaseToTrialSessionSequence');
    await wait(1000);

    const trialSessionJudge = cerebralTest.getState('trialSessionJudge');
    expect(trialSessionJudge).toMatchObject(
      expect.objectContaining({
        name: expect.anything(),
        userId: expect.anything(),
      }),
    );
  });
};
