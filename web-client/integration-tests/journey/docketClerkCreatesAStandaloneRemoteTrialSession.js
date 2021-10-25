import {
  SESSION_TYPES,
  TRIAL_SESSION_SCOPE_TYPES,
} from '../../../shared/src/business/entities/EntityConstants';
import { TrialSession } from '../../../shared/src/business/entities/trialSessions/TrialSession';

const errorMessages = TrialSession.VALIDATION_ERROR_MESSAGES;

export const docketClerkCreatesAStandaloneRemoteTrialSession = cerebralTest => {
  return it('Docket clerk starts a remote trial session', async () => {
    await cerebralTest.runSequence('gotoAddTrialSessionSequence');

    await cerebralTest.runSequence('updateTrialSessionFormDataSequence', {
      key: 'sessionScope',
      value: TRIAL_SESSION_SCOPE_TYPES.standaloneRemote,
    });

    expect(cerebralTest.getState('validationErrors')).toEqual({});

    await cerebralTest.runSequence('submitTrialSessionSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({
      sessionType: errorMessages.sessionType,
      startDate: errorMessages.startDate[1],
      term: errorMessages.term,
      termYear: errorMessages.termYear,
    });

    const fieldsToUpdate = {
      day: '5',
      month: '5',
      sessionType: SESSION_TYPES.small,
      year: '2021',
    };

    for (let [key, value] of Object.entries(fieldsToUpdate)) {
      await cerebralTest.runSequence('updateTrialSessionFormDataSequence', {
        key,
        value,
      });
    }

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
