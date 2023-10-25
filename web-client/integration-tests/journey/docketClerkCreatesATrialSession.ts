import { FORMATS } from '@shared/business/utilities/DateHandler';
import {
  SESSION_TYPES,
  TRIAL_SESSION_PROCEEDING_TYPES,
  TrialSessionTypes,
} from '../../../shared/src/business/entities/EntityConstants';
import { TrialSession } from '../../../shared/src/business/entities/trialSessions/TrialSession';
import { extractCustomMessages } from '@shared/business/entities/utilities/extractCustomMessages';
const customMessages = extractCustomMessages(TrialSession);

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
      maxCases: customMessages.maxCases[0],
      sessionType: customMessages.sessionType[0],
      startDate: customMessages.startDate[0],
      term: customMessages.term[0],
      termYear: customMessages.termYear[0],
      trialLocation: customMessages.trialLocation[0],
    });

    const createTrialSessionForm = {
      address1: '123 Flavor Ave',
      chambersPhoneNumber: '1234567890',
      city: 'Seattle',
      judge: judge || {
        name: 'Cohen',
        userId: 'dabbad04-18d0-43ec-bafb-654e83405416',
      },
      maxCases,
      postalCode: '98101',
      proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.inPerson,
      sessionType,
      state: 'WA',
      trialClerk,
    };

    for (let [key, value] of Object.entries(createTrialSessionForm)) {
      await cerebralTest.runSequence('updateTrialSessionFormDataSequence', {
        key,
        value,
      });
    }

    await cerebralTest.runSequence(
      'formatAndUpdateDateFromDatePickerSequence',
      {
        key: 'startDate',
        toFormat: FORMATS.ISO,
        value: `13/${trialDay}/${trialYear}`,
      },
    );

    await cerebralTest.runSequence(
      'formatAndUpdateDateFromDatePickerSequence',
      {
        key: 'estimatedEndDate',
        toFormat: FORMATS.ISO,
        value: '01/01/1995',
      },
    );

    await cerebralTest.runSequence('validateTrialSessionSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({
      startDate: customMessages.startDate[0],
      term: customMessages.term[0],
      trialLocation: customMessages.trialLocation[0],
    });

    await cerebralTest.runSequence(
      'formatAndUpdateDateFromDatePickerSequence',
      {
        key: 'startDate',
        toFormat: FORMATS.ISO,
        value: `${trialMonth}/${trialDay}/${trialYear}`,
      },
    );

    await cerebralTest.runSequence('validateTrialSessionSequence');

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
      estimatedEndDate: customMessages.estimatedEndDate[0],
    });

    await cerebralTest.runSequence(
      'formatAndUpdateDateFromDatePickerSequence',
      {
        key: 'estimatedEndDate',
        toFormat: FORMATS.ISO,
        value: '01/01/2050',
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
