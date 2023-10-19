import { FORMATS } from '@shared/business/utilities/DateHandler';
import {
  TRIAL_SESSION_PROCEEDING_TYPES,
  TRIAL_SESSION_SCOPE_TYPES,
} from '../../../shared/src/business/entities/EntityConstants';
import { TrialSession } from '../../../shared/src/business/entities/trialSessions/TrialSession';

export const docketClerkCreatesARemoteTrialSession = (
  cerebralTest,
  overrides = {},
) => {
  return it('Docket clerk starts a remote trial session', async () => {
    await cerebralTest.runSequence('gotoAddTrialSessionSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({});

    await cerebralTest.runSequence('submitTrialSessionSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({
      maxCases: TrialSession.VALIDATION_ERROR_MESSAGES.maxCases,
      sessionType: TrialSession.VALIDATION_ERROR_MESSAGES.sessionType,
      startDate: TrialSession.VALIDATION_ERROR_MESSAGES.startDate[1],
      term: TrialSession.VALIDATION_ERROR_MESSAGES.term,
      termYear: TrialSession.VALIDATION_ERROR_MESSAGES.termYear,
      trialLocation: TrialSession.VALIDATION_ERROR_MESSAGES.trialLocation,
    });

    await cerebralTest.runSequence('updateTrialSessionFormDataSequence', {
      key: 'proceedingType',
      value: TRIAL_SESSION_PROCEEDING_TYPES.remote,
    });

    await cerebralTest.runSequence('updateTrialSessionFormDataSequence', {
      key: 'sessionScope',
      value: TRIAL_SESSION_SCOPE_TYPES.standaloneRemote,
    });

    await cerebralTest.runSequence('updateTrialSessionFormDataSequence', {
      key: 'maxCases',
      value: overrides.maxCases || 100,
    });

    await cerebralTest.runSequence('updateTrialSessionFormDataSequence', {
      key: 'sessionType',
      value: overrides.sessionType || 'Hybrid',
    });

    await cerebralTest.runSequence(
      'formatAndUpdateDateFromDatePickerSequence',
      {
        key: 'startDate',
        toFormat: FORMATS.ISO,
        value: '13/12/2025',
      },
    );

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

    expect(cerebralTest.getState('validationErrors')).toMatchObject({
      startDate: TrialSession.VALIDATION_ERROR_MESSAGES.startDate[1],
      term: TrialSession.VALIDATION_ERROR_MESSAGES.term,
    });

    await cerebralTest.runSequence(
      'formatAndUpdateDateFromDatePickerSequence',
      {
        key: 'startDate',
        toFormat: FORMATS.ISO,
        value: '12/12/2025',
      },
    );

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
    cerebralTest.trialSessionId = cerebralTest.lastCreatedTrialSessionId;
  });
};
