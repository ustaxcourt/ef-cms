import { FORMATS } from '@shared/business/utilities/DateHandler';
import {
  SESSION_TYPES,
  TRIAL_SESSION_PROCEEDING_TYPES,
  TrialSessionTypes,
} from '../../../shared/src/business/entities/EntityConstants';
import { TrialSession } from '../../../shared/src/business/entities/trialSessions/TrialSession';

type CreateTrialSessionOverrides = {
  maxCases?: number;
  sessionType?: TrialSessionTypes;
  trialDay?: string;
  trialYear?: string;
  trialLocation?: string;
  trialClerk?: { name: string; userId: string };
  isSwingSession?: boolean;
  trialMonth?: string;
  swingSessionId?: string;
  judge?: any;
};

export const docketClerkCreatesATrialSession = (
  cerebralTest,
  {
    isSwingSession = false,
    judge = undefined,
    maxCases = 100,
    sessionType = SESSION_TYPES.hybrid,
    swingSessionId = undefined,
    trialClerk = undefined,
    trialDay = '12',
    trialLocation = 'Seattle, Washington',
    trialMonth = '12',
    trialYear = '2025',
  }: CreateTrialSessionOverrides = {},
) => {
  return it('Docket clerk starts a trial session', async () => {
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

    /* eslint-disable sort-keys-fix/sort-keys-fix */
    const createTrialSessionForm = {
      maxCases,
      proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.inPerson,
      sessionType,
      startDate: `13/${trialDay}/${trialYear}`,
      estimatedEndDate: '01/01/1995',
      address1: '123 Flavor Ave',
      city: 'Seattle',
      state: 'WA',
      postalCode: '98101',
      chambersPhoneNumber: '1234567890',
      judge: judge || {
        name: 'Cohen',
        userId: 'dabbad04-18d0-43ec-bafb-654e83405416',
      },
      trialClerk,
    };

    for (let [key, value] of Object.entries(createTrialSessionForm)) {
      await cerebralTest.runSequence('updateTrialSessionFormDataSequence', {
        key,
        value,
      });
    }

    await cerebralTest.runSequence('validateTrialSessionSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({
      startDate: TrialSession.VALIDATION_ERROR_MESSAGES.startDate[1],
      term: TrialSession.VALIDATION_ERROR_MESSAGES.term,
      trialLocation: TrialSession.VALIDATION_ERROR_MESSAGES.trialLocation,
    });

    await cerebralTest.runSequence(
      'formatAndUpdateDateFromDatePickerSequence',
      {
        key: 'startDate',
        value: `${trialMonth}/${trialDay}/${trialYear}`,
        toFormat: FORMATS.ISO,
      },
    );

    if (!trialMonth) {
      expect(cerebralTest.getState('form.term')).toEqual('Fall');
    }

    expect(cerebralTest.getState('form.termYear')).toEqual(trialYear);

    await cerebralTest.runSequence('updateTrialSessionFormDataSequence', {
      key: 'trialLocation',
      value: trialLocation,
    });

    await cerebralTest.runSequence('validateTrialSessionSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({
      estimatedEndDate:
        TrialSession.VALIDATION_ERROR_MESSAGES.estimatedEndDate[1],
    });

    await cerebralTest.runSequence(
      'formatAndUpdateDateFromDatePickerSequence',
      {
        key: 'estimatedEndDate',
        value: '01/01/2050',
        toFormat: FORMATS.ISO,
      },
    );

    await cerebralTest.runSequence('updateTrialSessionFormDataSequence', {
      key: 'swingSession',
      value: isSwingSession,
    });

    await cerebralTest.runSequence('updateTrialSessionFormDataSequence', {
      key: 'swingSessionId',
      value: swingSessionId,
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
