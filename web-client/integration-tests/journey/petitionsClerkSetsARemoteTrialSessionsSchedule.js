import { wait } from '../helpers';

export const petitionsClerkSetsARemoteTrialSessionsSchedule = test => {
  return it('Petitions Clerk Sets A Remote Trial Sessions Schedule', async () => {
    await test.runSequence('gotoTrialSessionDetailSequence', {
      trialSessionId: test.trialSessionId,
    });
    await test.runSequence('openSetCalendarModalSequence');

    expect(test.getState('alertWarning.message')).toEqual(
      'Provide remote proceeding information to set this trial session.',
    );

    await test.runSequence('gotoEditTrialSessionSequence', {
      trialSessionId: test.trialSessionId,
    });

    await test.runSequence('updateTrialSessionFormDataSequence', {
      key: 'meetingId',
      value: '123456789',
    });

    await test.runSequence('updateTrialSessionFormDataSequence', {
      key: 'password',
      value: '123456789',
    });

    await test.runSequence('updateTrialSessionFormDataSequence', {
      key: 'joinPhoneNumber',
      value: '123456789',
    });

    await test.runSequence('updateTrialSessionFormDataSequence', {
      key: 'chambersPhoneNumber',
      value: '123456789',
    });

    await test.runSequence('updateTrialSessionSequence');

    await test.runSequence('openSetCalendarModalSequence');

    expect(test.getState('alertWarning.message')).toBeUndefined();

    await test.runSequence('setTrialSessionCalendarSequence');

    await wait(1000);
  });
};
