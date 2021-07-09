import { wait } from '../helpers';

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
      message: 'Provide an address and a judge to set this trial session.',
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
    await wait(1000); // we need to wait for some reason

    if (overrides.hasPaper) {
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
      expect(cerebralTest.getState('alertSuccess')).toEqual({
        message: 'Eligible cases set for trial.',
      });
    }
  });
};
