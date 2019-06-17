import { MOCK_CASE } from '../../../../shared/src/test/mockCase';
import { formattedTrialSessionDetails as formattedTrialSessionDetailsComputed } from './formattedTrialSessionDetails';
import { omit } from 'lodash';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../withAppContext';

const formattedTrialSessionDetails = withAppContextDecorator(
  formattedTrialSessionDetailsComputed,
);

describe('formattedTrialSessionDetails', () => {
  const TRIAL_SESSION = {
    city: 'Hartford',
    courtReporter: 'Test Court Reporter',
    irsCalendarAdministrator: 'Test Calendar Admin',
    judge: 'Test Judge',
    postalCode: '12345',
    startDate: '2019-11-25T15:00:00.000Z',
    startTime: '10:00',
    state: 'CT',
    term: 'Fall',
    termYear: '2019',
    trialClerk: 'Test Trial Clerk',
    trialLocation: 'Hartford, Connecticut',
  };

  it('formats trial session when all fields have values', async () => {
    const result = await runCompute(formattedTrialSessionDetails, {
      state: {
        trialSession: TRIAL_SESSION,
      },
    });
    expect(result).toMatchObject({
      formattedCityStateZip: 'Hartford, CT 12345',
      formattedCourtReporter: 'Test Court Reporter',
      formattedIrsCalendarAdministrator: 'Test Calendar Admin',
      formattedJudge: 'Test Judge',
      formattedStartTime: '10:00 am',
      formattedTerm: 'Fall 19',
      formattedTrialClerk: 'Test Trial Clerk',
      noLocationEntered: false,
      showSwingSession: false,
    });
  });

  it('formats trial session when address fields are empty', async () => {
    let result = await runCompute(formattedTrialSessionDetails, {
      state: {
        trialSession: omit(TRIAL_SESSION, ['city', 'state', 'postalCode']),
      },
    });
    expect(result).toMatchObject({
      formattedCityStateZip: '',
      noLocationEntered: true,
    });

    result = await runCompute(formattedTrialSessionDetails, {
      state: {
        trialSession: omit(TRIAL_SESSION, ['city']),
      },
    });
    expect(result).toMatchObject({
      formattedCityStateZip: 'CT 12345',
      noLocationEntered: false,
    });

    result = await runCompute(formattedTrialSessionDetails, {
      state: {
        trialSession: omit(TRIAL_SESSION, ['state']),
      },
    });
    expect(result).toMatchObject({
      formattedCityStateZip: 'Hartford, 12345',
      noLocationEntered: false,
    });

    result = await runCompute(formattedTrialSessionDetails, {
      state: {
        trialSession: omit(TRIAL_SESSION, ['state']),
      },
    });
    expect(result).toMatchObject({
      formattedCityStateZip: 'Hartford, 12345',
      noLocationEntered: false,
    });

    result = await runCompute(formattedTrialSessionDetails, {
      state: {
        trialSession: omit(TRIAL_SESSION, ['postalCode']),
      },
    });
    expect(result).toMatchObject({
      formattedCityStateZip: 'Hartford, CT',
      noLocationEntered: false,
    });
  });

  it('formats trial session when session assignments are empty', async () => {
    let result = await runCompute(formattedTrialSessionDetails, {
      state: {
        trialSession: omit(TRIAL_SESSION, [
          'courtReporter',
          'irsCalendarAdministrator',
          'judge',
          'trialClerk',
        ]),
      },
    });
    expect(result).toMatchObject({
      formattedCourtReporter: 'Not assigned',
      formattedIrsCalendarAdministrator: 'Not assigned',
      formattedJudge: 'Not assigned',
      formattedTrialClerk: 'Not assigned',
    });
  });

  it('formats trial session start time', async () => {
    let result = await runCompute(formattedTrialSessionDetails, {
      state: {
        trialSession: { ...TRIAL_SESSION, startTime: '14:00' },
      },
    });
    expect(result).toMatchObject({
      formattedStartTime: '2:00 pm',
    });
  });

  it('displays swing session area if session is a swing session', async () => {
    let result = await runCompute(formattedTrialSessionDetails, {
      state: {
        trialSession: {
          ...TRIAL_SESSION,
          swingSession: true,
          swingSessionId: '1234',
          swingSessionLocation: 'Honolulu, Hawaii',
        },
      },
    });
    expect(result).toMatchObject({
      showSwingSession: true,
    });
  });

  it('formats docket numbers with suffixes on eligible cases', async () => {
    let result = await runCompute(formattedTrialSessionDetails, {
      state: {
        eligibleCases: [MOCK_CASE, { ...MOCK_CASE, docketNumberSuffix: 'W' }],
        trialSession: TRIAL_SESSION,
      },
    });
    expect(result.formattedEligibleCases.length).toEqual(2);
    expect(result.formattedEligibleCases[0].docketNumberWithSuffix).toEqual(
      '101-18',
    );
    expect(result.formattedEligibleCases[1].docketNumberWithSuffix).toEqual(
      '101-18W',
    );
  });
});
