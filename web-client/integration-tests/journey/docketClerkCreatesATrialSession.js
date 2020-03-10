import { TrialSession } from '../../../shared/src/business/entities/trialSessions/TrialSession';

const errorMessages = TrialSession.VALIDATION_ERROR_MESSAGES;

export const docketClerkCreatesATrialSession = (test, overrides = {}) => {
  return it('Docket clerk starts a trial session', async () => {
    await test.runSequence('gotoAddTrialSessionSequence');

    expect(test.getState('validationErrors')).toEqual({});

    await test.runSequence('submitTrialSessionSequence');

    expect(test.getState('validationErrors')).toEqual({
      maxCases: errorMessages.maxCases,
      sessionType: errorMessages.sessionType,
      startDate: errorMessages.startDate[1],
      term: errorMessages.term,
      termYear: errorMessages.termYear,
      trialLocation: errorMessages.trialLocation,
    });

    await test.runSequence('updateTrialSessionFormDataSequence', {
      key: 'maxCases',
      value: overrides.maxCases || 100,
    });

    await test.runSequence('updateTrialSessionFormDataSequence', {
      key: 'sessionType',
      value: overrides.sessionType || 'Hybrid',
    });

    await test.runSequence('updateTrialSessionFormDataSequence', {
      key: 'month',
      value: '13',
    });

    await test.runSequence('updateTrialSessionFormDataSequence', {
      key: 'day',
      value: '12',
    });

    await test.runSequence('updateTrialSessionFormDataSequence', {
      key: 'year',
      value: '2025',
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

    if (overrides.trialClerk) {
      await test.runSequence('updateTrialSessionFormDataSequence', {
        key: 'trialClerk',
        value: overrides.trialClerk,
      });
    }

    await test.runSequence('validateTrialSessionSequence');

    expect(test.getState('validationErrors')).toEqual({
      startDate: errorMessages.startDate[1],
      term: errorMessages.term,
      trialLocation: errorMessages.trialLocation,
    });

    await test.runSequence('updateTrialSessionFormDataSequence', {
      key: 'month',
      value: '12',
    });

    await test.runSequence('validateTrialSessionSequence');

    expect(test.getState('form.term')).toEqual('Fall');
    expect(test.getState('form.termYear')).toEqual('2025');

    await test.runSequence('updateTrialSessionFormDataSequence', {
      key: 'trialLocation',
      value: overrides.trialLocation || 'Seattle, Washington',
    });

    await test.runSequence('validateTrialSessionSequence');

    expect(test.getState('validationErrors')).toEqual({});

    await test.runSequence('submitTrialSessionSequence');
  });
};
