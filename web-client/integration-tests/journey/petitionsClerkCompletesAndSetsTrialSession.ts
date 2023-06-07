import {
  waitForExpectedItem,
  waitForLoadingComponentToHide,
  waitForModalsToHide,
} from '../helpers';

export const petitionsClerkCompletesAndSetsTrialSession = (
  cerebralTest,
  overrides = {},
) => {
  return it('petitions clerk completes a trial session before calendaring', async () => {
    await cerebralTest.runSequence('gotoEditTrialSessionSequence', {
      trialSessionId: cerebralTest.trialSessionId,
    });

    expect(cerebralTest.getState('currentPage')).toEqual('EditTrialSession');

    await cerebralTest.runSequence('openSetCalendarModalSequence');

    expect(cerebralTest.getState('alertWarning')).toEqual({
      message:
        'Provide an address, a judge, and a chambers phone number to set this trial session.',
    });

    await cerebralTest.runSequence('updateTrialSessionFormDataSequence', {
      key: 'address1',
      value: '123 Flavor Ave',
    });

    await cerebralTest.runSequence('updateTrialSessionFormDataSequence', {
      key: 'city',
      value: 'Seattle',
    });

    await cerebralTest.runSequence('updateTrialSessionFormDataSequence', {
      key: 'state',
      value: 'WA',
    });

    await cerebralTest.runSequence('updateTrialSessionFormDataSequence', {
      key: 'postalCode',
      value: '98101',
    });

    await cerebralTest.runSequence('updateTrialSessionFormDataSequence', {
      key: 'chambersPhoneNumber',
      value: '1234567890',
    });

    await cerebralTest.runSequence('updateTrialSessionFormDataSequence', {
      key: 'judge',
      value: overrides.judge || {
        name: 'Cohen',
        userId: 'dabbad04-18d0-43ec-bafb-654e83405416',
      },
    });

    await cerebralTest.runSequence('updateTrialSessionSequence');
    await cerebralTest.runSequence('gotoTrialSessionDetailSequence', {
      trialSessionId: cerebralTest.trialSessionId,
    });
    expect(cerebralTest.getState('currentPage')).toEqual('TrialSessionDetail');

    await cerebralTest.runSequence('setTrialSessionCalendarSequence');

    await waitForLoadingComponentToHide({ cerebralTest });
    await waitForModalsToHide({ cerebralTest, maxWait: 120000 });

    if (overrides.hasPaper) {
      await waitForExpectedItem({
        cerebralTest,
        currentItem: 'currentPage',
        expectedItem: 'PrintPaperTrialNotices',
      });
      expect(cerebralTest.getState('currentPage')).toEqual(
        'PrintPaperTrialNotices',
      );
      expect(cerebralTest.getState('alertWarning')).toEqual({
        message: 'Print and mail all paper service documents now.',
      });
    } else {
      expect(cerebralTest.getState('currentPage')).toEqual(
        'TrialSessionDetail',
      );

      const expectedAlertMessage = 'Eligible cases set for trial.';
      await waitForExpectedItem({
        cerebralTest,
        currentItem: 'alertSuccess.message',
        expectedItem: expectedAlertMessage,
      });
      expect(cerebralTest.getState('alertSuccess')).toEqual({
        message: expectedAlertMessage,
      });
    }
  });
};
