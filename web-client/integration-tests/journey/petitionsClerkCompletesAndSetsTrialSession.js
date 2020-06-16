import { wait } from '../helpers';

export const petitionsClerkCompletesAndSetsTrialSession = (
  test,
  overrides = {},
) => {
  return it('petitions clerk completes a trial session before calendaring', async () => {
    await test.runSequence('gotoEditTrialSessionSequence', {
      trialSessionId: test.trialSessionId,
    });

    expect(test.getState('currentPage')).toEqual('EditTrialSession');

    await test.runSequence('openSetCalendarModalSequence');

    expect(test.getState('alertWarning')).toEqual({
      message: 'Provide an address and a judge to set this trial session.',
    });

    await test.runSequence('updateTrialSessionFormDataSequence', {
      key: 'address1',
      value: '123 Flavor Ave',
    });

    await test.runSequence('updateTrialSessionFormDataSequence', {
      key: 'city',
      value: 'Seattle',
    });

    await test.runSequence('updateTrialSessionFormDataSequence', {
      key: 'state',
      value: 'WA',
    });

    await test.runSequence('updateTrialSessionFormDataSequence', {
      key: 'postalCode',
      value: '98101',
    });

    await test.runSequence('updateTrialSessionFormDataSequence', {
      key: 'judge',
      value: overrides.judge || {
        name: 'Judge Cohen',
        userId: 'dabbad04-18d0-43ec-bafb-654e83405416',
      },
    });

    await test.runSequence('updateTrialSessionSequence');
    await test.runSequence('gotoTrialSessionDetailSequence', {
      trialSessionId: test.trialSessionId,
    });
    expect(test.getState('currentPage')).toEqual('TrialSessionDetail');

    await test.runSequence('setTrialSessionCalendarSequence');
    await wait(1000); // we need to wait for some reason

    if (overrides.hasPaper) {
      expect(test.getState('currentPage')).toEqual('PrintPaperService');
      expect(test.getState('alertWarning')).toEqual({
        message: 'Print and mail all paper service documents now.',
      });
    } else {
      expect(test.getState('currentPage')).toEqual('TrialSessionDetail');
      expect(test.getState('alertSuccess')).toEqual({
        message: 'Eligible cases set for trial.',
      });
    }
  });
};
