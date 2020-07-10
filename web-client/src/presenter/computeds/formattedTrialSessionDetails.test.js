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
    caseOrder: [],
    city: 'Hartford',
    courtReporter: 'Test Court Reporter',
    irsCalendarAdministrator: 'Test Calendar Admin',
    isCalendared: false,
    judge: { name: 'Test Judge' },
    postalCode: '12345',
    startDate: '2019-11-25T15:00:00.000Z',
    startTime: '10:00',
    state: 'CT',
    term: 'Fall',
    termYear: '2019',
    trialClerk: { name: 'Test Trial Clerk' },
    trialLocation: 'Hartford, Connecticut',
  };

  it('returns undefined if state.trialSession is undefined', () => {
    const result = runCompute(formattedTrialSessionDetails, {
      state: {},
    });
    expect(result).toBeUndefined();
  });

  it('formats trial session when all fields have values', () => {
    const result = runCompute(formattedTrialSessionDetails, {
      state: {
        trialSession: {
          ...TRIAL_SESSION,
        },
      },
    });
    expect(result).toMatchObject({
      canDelete: false,
      canEdit: false,
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

  it('trial session can not be edited or deleted when in the past', () => {
    const result = runCompute(formattedTrialSessionDetails, {
      state: {
        trialSession: {
          ...TRIAL_SESSION,
          isCalendared: false,
          startDate: '2000-11-25T15:00:00.000Z',
        },
      },
    });
    expect(result).toMatchObject({
      canDelete: false,
      canEdit: false,
    });
  });

  it('trial session can be edited only in the future', () => {
    const result = runCompute(formattedTrialSessionDetails, {
      state: {
        trialSession: {
          ...TRIAL_SESSION,
          isCalendared: false,
          startDate: '2090-11-25T15:00:00.000Z',
        },
      },
    });
    expect(result).toMatchObject({
      canDelete: true,
      canEdit: true,
    });
  });

  it('trial session can not be deleted when calendared but it still can be edited if in the future', () => {
    const result = runCompute(formattedTrialSessionDetails, {
      state: {
        trialSession: {
          ...TRIAL_SESSION,
          isCalendared: true,
          startDate: '2090-11-25T15:00:00.000Z',
        },
      },
    });
    expect(result).toMatchObject({
      canDelete: false,
      canEdit: true,
    });
  });

  it('trial session can not be deleted or edited when calendared and in the past', () => {
    const result = runCompute(formattedTrialSessionDetails, {
      state: {
        trialSession: {
          ...TRIAL_SESSION,
          isCalendared: true,
          startDate: '2000-11-25T15:00:00.000Z',
        },
      },
    });
    expect(result).toMatchObject({
      canDelete: false,
      canEdit: false,
    });
  });

  it('formats trial session when address fields are empty', () => {
    let result = runCompute(formattedTrialSessionDetails, {
      state: {
        trialSession: {
          ...omit(TRIAL_SESSION, ['city', 'state', 'postalCode']),
        },
      },
    });
    expect(result).toMatchObject({
      formattedCityStateZip: '',
      noLocationEntered: true,
    });

    result = runCompute(formattedTrialSessionDetails, {
      state: {
        trialSession: {
          ...omit(TRIAL_SESSION, ['city']),
        },
      },
    });
    expect(result).toMatchObject({
      formattedCityStateZip: 'CT 12345',
      noLocationEntered: false,
    });

    result = runCompute(formattedTrialSessionDetails, {
      state: {
        trialSession: {
          ...omit(TRIAL_SESSION, ['state']),
        },
      },
    });
    expect(result).toMatchObject({
      formattedCityStateZip: 'Hartford, 12345',
      noLocationEntered: false,
    });

    result = runCompute(formattedTrialSessionDetails, {
      state: {
        trialSession: {
          ...omit(TRIAL_SESSION, ['state']),
        },
      },
    });
    expect(result).toMatchObject({
      formattedCityStateZip: 'Hartford, 12345',
      noLocationEntered: false,
    });

    result = runCompute(formattedTrialSessionDetails, {
      state: {
        trialSession: {
          ...omit(TRIAL_SESSION, ['postalCode']),
        },
      },
    });
    expect(result).toMatchObject({
      formattedCityStateZip: 'Hartford, CT',
      noLocationEntered: false,
    });
  });

  it('formats trial session when session assignments are empty', () => {
    let result = runCompute(formattedTrialSessionDetails, {
      state: {
        trialSession: {
          ...omit(TRIAL_SESSION, [
            'courtReporter',
            'irsCalendarAdministrator',
            'judge',
            'trialClerk',
          ]),
        },
      },
    });
    expect(result).toMatchObject({
      formattedCourtReporter: 'Not assigned',
      formattedIrsCalendarAdministrator: 'Not assigned',
      formattedJudge: 'Not assigned',
      formattedTrialClerk: 'Not assigned',
    });
  });

  it('formats trial session start time', () => {
    let result = runCompute(formattedTrialSessionDetails, {
      state: {
        trialSession: {
          ...TRIAL_SESSION,
          startTime: '14:00',
        },
      },
    });
    expect(result).toMatchObject({
      formattedStartTime: '2:00 pm',
    });
  });

  it('displays swing session area if session is a swing session', () => {
    let result = runCompute(formattedTrialSessionDetails, {
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

  it('formats docket numbers with suffixes and case caption names without postfix on eligible cases', () => {
    let result = runCompute(formattedTrialSessionDetails, {
      state: {
        trialSession: {
          ...TRIAL_SESSION,
          eligibleCases: [
            MOCK_CASE,
            {
              ...MOCK_CASE,
              caseCaption: 'Daenerys Stormborn & Someone Else, Petitioners',
              docketNumberSuffix: 'W',
            },
            {
              ...MOCK_CASE,
              caseCaption: undefined,
              docketNumber: '103-19',
            },
          ],
        },
      },
    });
    expect(result.formattedEligibleCases.length).toEqual(3);
    expect(result.formattedEligibleCases[0].docketNumberWithSuffix).toEqual(
      '101-18',
    );
    expect(result.formattedEligibleCases[0].caseTitle).toEqual(
      'Test Petitioner',
    );
    expect(result.formattedEligibleCases[1].docketNumberWithSuffix).toEqual(
      '101-18W',
    );
    expect(result.formattedEligibleCases[1].caseTitle).toEqual(
      'Daenerys Stormborn & Someone Else',
    );
    expect(result.formattedEligibleCases[2].docketNumberWithSuffix).toEqual(
      '103-19',
    );
    expect(result.formattedEligibleCases[2].caseTitle).toEqual('');
  });

  it('formats docket numbers with suffixes and case caption names without postfix on calendared cases and splits them by open and closed cases', () => {
    let result = runCompute(formattedTrialSessionDetails, {
      state: {
        trialSession: {
          ...TRIAL_SESSION,
          calendaredCases: [
            MOCK_CASE,
            {
              ...MOCK_CASE,
              caseCaption: 'Daenerys Stormborn & Someone Else, Petitioners',
              caseId: 'ef88c665-4d1d-48a9-898a-eae698187b2b',
              docketNumberSuffix: 'W',
              removedFromTrial: true,
            },
          ],
          isCalendared: true,
        },
      },
    });
    expect(result.allCases.length).toEqual(2);
    expect(result.allCases[0].docketNumberWithSuffix).toEqual('101-18');
    expect(result.allCases[0].caseTitle).toEqual('Test Petitioner');
    expect(result.allCases[1].docketNumberWithSuffix).toEqual('101-18W');
    expect(result.allCases[1].caseTitle).toEqual(
      'Daenerys Stormborn & Someone Else',
    );

    expect(result.openCases.length).toEqual(1);
    expect(result.inactiveCases.length).toEqual(1);
    expect(result.openCases[0].docketNumberWithSuffix).toEqual('101-18');
    expect(result.inactiveCases[0].docketNumberWithSuffix).toEqual('101-18W');
  });

  it('sorts calendared cases by docket number', () => {
    let result = runCompute(formattedTrialSessionDetails, {
      state: {
        trialSession: {
          ...TRIAL_SESSION,
          calendaredCases: [
            MOCK_CASE,
            { ...MOCK_CASE, docketNumber: '102-19' },
            { ...MOCK_CASE, docketNumber: '5000-17' },
            { ...MOCK_CASE, docketNumber: '500-17' },
            { ...MOCK_CASE, docketNumber: '90-07' },
          ],
        },
      },
    });
    expect(result.allCases).toMatchObject([
      { docketNumber: '90-07' },
      { docketNumber: '500-17' },
      { docketNumber: '5000-17' },
      { docketNumber: '101-18' },
      { docketNumber: '102-19' },
    ]);
  });

  it('should show open cases when the trial session is calendared and has open cases', () => {
    let result = runCompute(formattedTrialSessionDetails, {
      state: {
        trialSession: {
          ...TRIAL_SESSION,
          caseOrder: [{ caseId: 'eaff20df-d86e-48ab-adc2-831b6ad7e039' }],
          isCalendared: true,
        },
      },
    });
    expect(result.showOpenCases).toEqual(true);
  });

  it('should show only closed cases when the trial session is calendared and has no open cases', () => {
    let result = runCompute(formattedTrialSessionDetails, {
      state: {
        trialSession: {
          ...TRIAL_SESSION,
          caseOrder: [
            {
              caseId: 'eaff20df-d86e-48ab-adc2-831b6ad7e039',
              removedFromTrial: true,
            },
          ],
          isCalendared: true,
        },
      },
    });
    expect(result.showOnlyClosedCases).toEqual(true);
  });
});
