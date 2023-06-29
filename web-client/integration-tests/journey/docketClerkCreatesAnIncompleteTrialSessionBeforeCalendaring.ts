import { TRIAL_SESSION_PROCEEDING_TYPES } from '../../../shared/src/business/entities/EntityConstants';
import { TrialSession } from '../../../shared/src/business/entities/trialSessions/TrialSession';

const errorMessages = TrialSession.VALIDATION_ERROR_MESSAGES;

export const docketClerkCreatesAnIncompleteTrialSessionBeforeCalendaring = (
  cerebralTest,
  overrides = {},
) => {
  return it('Docket clerk starts a trial session before calendaring', async () => {
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
      key: 'startDateMonth',
      value: '8',
    });

    await cerebralTest.runSequence('updateTrialSessionFormDataSequence', {
      key: 'startDateDay',
      value: '12',
    });

    await cerebralTest.runSequence('updateTrialSessionFormDataSequence', {
      key: 'startDateYear',
      value: '2025',
    });

    await cerebralTest.runSequence('updateTrialSessionFormDataSequence', {
      key: 'startDateMonth',
      value: '12',
    });

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
