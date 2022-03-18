// import { wait } from '../helpers';
// import { withAppContextDecorator } from '../../src/withAppContext';

export const manuallyAddCaseToTrial = cerebralTest => {
  return it('manually add a case to a trial session', async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    await cerebralTest.runSequence('openAddToTrialModalSequence');

    await cerebralTest.runSequence('updateModalValueSequence', {
      key: 'showAllLocations',
      value: true,
    });

    await cerebralTest.runSequence('updateModalValueSequence', {
      key: 'trialSessionId',
      value: cerebralTest.trialSessionId,
    });

    await cerebralTest.runSequence('addCaseToTrialSessionSequence');

    // await wait(1000);
  });
};
