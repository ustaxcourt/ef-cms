import {
  waitForExpectedItem,
  waitForLoadingComponentToHide,
  waitForModalsToHide,
  waitForPage,
} from '../helpers';

export const petitionsClerkSetsARemoteTrialSessionsSchedule = cerebralTest => {
  return it('Petitions Clerk Sets A Remote Trial Sessions Schedule', async () => {
    await cerebralTest.runSequence('gotoTrialSessionDetailSequence', {
      trialSessionId: cerebralTest.trialSessionId,
    });
    await cerebralTest.runSequence('openSetCalendarModalSequence');

    expect(cerebralTest.getState('alertWarning.message')).toEqual(
      'Provide remote proceeding information to set this trial session.',
    );

    await cerebralTest.runSequence('gotoEditTrialSessionSequence', {
      trialSessionId: cerebralTest.trialSessionId,
    });

    await cerebralTest.runSequence('updateTrialSessionFormDataSequence', {
      key: 'meetingId',
      value: '123456789',
    });

    await cerebralTest.runSequence('updateTrialSessionFormDataSequence', {
      key: 'password',
      value: '123456789',
    });

    await cerebralTest.runSequence('updateTrialSessionFormDataSequence', {
      key: 'joinPhoneNumber',
      value: '123456789',
    });

    await cerebralTest.runSequence('updateTrialSessionFormDataSequence', {
      key: 'chambersPhoneNumber',
      value: '123456789',
    });

    await cerebralTest.runSequence('updateTrialSessionSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({});

    await waitForLoadingComponentToHide({ cerebralTest, maxWait: 60000 });
    await waitForPage({
      cerebralTest,
      expectedPage: 'TrialSessionDetails',
      maxWait: 60000,
    });

    await cerebralTest.runSequence('openSetCalendarModalSequence');

    expect(cerebralTest.getState('alertWarning.message')).toBeUndefined();

    await cerebralTest.runSequence('setTrialSessionCalendarSequence');

    await waitForLoadingComponentToHide({ cerebralTest, maxWait: 120000 });
    await waitForModalsToHide({ cerebralTest, maxWait: 120000 });
    await waitForExpectedItem({
      cerebralTest,
      currentItem: 'currentPage',
      expectedItem: 'TrialSessionDetails',
    });
  });
};
