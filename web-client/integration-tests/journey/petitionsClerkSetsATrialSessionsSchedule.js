import { wait } from '../helpers';

export const petitionsClerkSetsATrialSessionsSchedule = cerebralTest => {
  return it('Petitions Clerk Sets A Trial Sessions Schedule', async () => {
    await cerebralTest.runSequence('gotoTrialSessionDetailSequence', {
      trialSessionId: cerebralTest.trialSessionId,
    });

    await cerebralTest.runSequence('openSetCalendarModalSequence');
    expect(cerebralTest.getState('alertWarning.message')).toBeUndefined();

    await cerebralTest.runSequence('setTrialSessionCalendarSequence');
    await wait(1000);
  });
};
