import { TRIAL_SESSION_PROCEEDING_TYPES } from '../../../shared/src/business/entities/EntityConstants';
import { TrialSession } from '../../../shared/src/business/entities/trialSessions/TrialSession';

const errorMessages = TrialSession.VALIDATION_ERROR_MESSAGES;

export const docketClerkCreatesATrialSession = (
  cerebralTest,
  overrides = {},
) => {
  return it('Docket clerk starts a trial session', async () => {
    await cerebralTest.runSequence('gotoAddTrialSessionSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({});

    await cerebralTest.runSequence('submitTrialSessionSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({
      maxCases: errorMessages.maxCases,
      sessionType: errorMessages.sessionType,
      startDate: errorMessages.startDate[1],
      term: errorMessages.term,
      termYear: errorMessages.termYear,
      trialLocation: errorMessages.trialLocation,
    });

    await cerebralTest.runSequence('updateTrialSessionFormDataSequence', {
      key: 'proceedingType',
      value: TRIAL_SESSION_PROCEEDING_TYPES.inPerson,
    });

    await cerebralTest.runSequence('updateTrialSessionFormDataSequence', {
      key: 'maxCases',
      value: overrides.maxCases || 100,
    });

    await cerebralTest.runSequence('updateTrialSessionFormDataSequence', {
      key: 'sessionType',
      value: overrides.sessionType || 'Hybrid',
    });

    await cerebralTest.runSequence('updateTrialSessionFormDataSequence', {
      key: 'month',
      value: '13',
    });

    await cerebralTest.runSequence('updateTrialSessionFormDataSequence', {
      key: 'day',
      value: '12',
    });

    await cerebralTest.runSequence('updateTrialSessionFormDataSequence', {
      key: 'year',
      value: '2025',
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

    if (overrides.trialClerk) {
      await cerebralTest.runSequence('updateTrialSessionFormDataSequence', {
        key: 'trialClerk',
        value: overrides.trialClerk,
      });
    }

    await cerebralTest.runSequence('validateTrialSessionSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({
      startDate: errorMessages.startDate[1],
      term: errorMessages.term,
      trialLocation: errorMessages.trialLocation,
    });

    await cerebralTest.runSequence('updateTrialSessionFormDataSequence', {
      key: 'month',
      value: '12',
    });

    await cerebralTest.runSequence('validateTrialSessionSequence');

    expect(cerebralTest.getState('form.term')).toEqual('Fall');
    expect(cerebralTest.getState('form.termYear')).toEqual('2025');

    await cerebralTest.runSequence('updateTrialSessionFormDataSequence', {
      key: 'trialLocation',
      value: overrides.trialLocation || 'Seattle, Washington',
    });

    await cerebralTest.runSequence('validateTrialSessionSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({});

    await cerebralTest.runSequence('submitTrialSessionSequence');

    expect(cerebralTest.getState('alertSuccess')).toEqual({
      message: 'Trial session added.',
    });

    const lastCreatedTrialSessionId = cerebralTest.getState(
      'lastCreatedTrialSessionId',
    );
    expect(lastCreatedTrialSessionId).toBeDefined();

    cerebralTest.lastCreatedTrialSessionId = lastCreatedTrialSessionId;
  });
};
