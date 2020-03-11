import { wait } from '../helpers';

export default (test, overrides = {}) => {
  return it('petitions clerk completes a trial session before calendaring', async () => {
    await test.runSequence('gotoEditTrialSessionSequence', {
      trialSessionId: test.trialSessionId,
    });

    expect(test.getState('currentPage')).toEqual('EditTrialSession');

    await test.runSequence('openSetCalendarModalSequence');

    expect(test.getState('alertWarning')).toEqual({
      message:
        'You must provide an address and a judge to be able to set this trial session ',
      title: 'This trial session requires additional information',
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
      expect(test.getState('currentPage')).toEqual('SimplePdfPreviewPage');
      expect(test.getState('alertWarning')).toEqual({
        message:
          'These cases have parties receiving paper service. Print and mail all paper service documents below.',
      });
    } else {
      expect(test.getState('currentPage')).toEqual('TrialSessionDetail');
      expect(test.getState('alertSuccess')).toEqual({
        message: 'You can view all cases set for this trial session below.',
        title: 'Eligible cases have been set for this trial session.',
      });
    }
  });
};
