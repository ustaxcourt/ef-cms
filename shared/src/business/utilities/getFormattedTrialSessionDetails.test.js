import {
  DOCKET_NUMBER_SUFFIXES,
  SESSION_STATUS_GROUPS,
} from '../entities/EntityConstants';
import { MOCK_CASE } from '../../../../shared/src/test/mockCase';
import { applicationContext } from '../test/createTestApplicationContext';
import {
  compareTrialSessionEligibleCases,
  formatCase,
  formattedTrialSessionDetails,
} from './getFormattedTrialSessionDetails';
import { omit } from 'lodash';

describe('formattedTrialSessionDetails', () => {
  const TRIAL_SESSION = {
    caseOrder: [],
    city: 'Hartford',
    courtReporter: 'Test Court Reporter',
    irsCalendarAdministrator: 'Test Calendar Admin',
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
    const result = formattedTrialSessionDetails({ applicationContext });
    expect(result).toBeUndefined();
  });

  it('formats trial session when all fields have values', () => {
    const result = formattedTrialSessionDetails({
      applicationContext,
      trialSession: TRIAL_SESSION,
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

  it('formats trial session when address fields are empty', () => {
    let result = formattedTrialSessionDetails({
      applicationContext,
      trialSession: omit(TRIAL_SESSION, ['city', 'state', 'postalCode']),
    });
    expect(result).toMatchObject({
      formattedCityStateZip: '',
      noLocationEntered: true,
    });

    result = formattedTrialSessionDetails({
      applicationContext,
      trialSession: omit(TRIAL_SESSION, ['city']),
    });
    expect(result).toMatchObject({
      formattedCityStateZip: 'CT 12345',
      noLocationEntered: false,
    });

    result = formattedTrialSessionDetails({
      applicationContext,
      trialSession: omit(TRIAL_SESSION, ['state']),
    });
    expect(result).toMatchObject({
      formattedCityStateZip: 'Hartford, 12345',
      noLocationEntered: false,
    });

    result = formattedTrialSessionDetails({
      applicationContext,
      trialSession: omit(TRIAL_SESSION, ['state']),
    });
    expect(result).toMatchObject({
      formattedCityStateZip: 'Hartford, 12345',
      noLocationEntered: false,
    });

    result = formattedTrialSessionDetails({
      applicationContext,
      trialSession: omit(TRIAL_SESSION, ['postalCode']),
    });
    expect(result).toMatchObject({
      formattedCityStateZip: 'Hartford, CT',
      noLocationEntered: false,
    });
  });

  it('formats trial session when session assignments are empty', () => {
    const result = formattedTrialSessionDetails({
      applicationContext,
      trialSession: omit(TRIAL_SESSION, [
        'courtReporter',
        'irsCalendarAdministrator',
        'judge',
        'trialClerk',
      ]),
    });
    expect(result).toMatchObject({
      formattedCourtReporter: 'Not assigned',
      formattedIrsCalendarAdministrator: 'Not assigned',
      formattedJudge: 'Not assigned',
      formattedTrialClerk: 'Not assigned',
    });
  });

  describe('formats trial session start times', () => {
    it('formats trial session start time', () => {
      const result = formattedTrialSessionDetails({
        applicationContext,
        trialSession: {
          ...TRIAL_SESSION,
          startTime: '14:00',
        },
      });
      expect(result).toMatchObject({
        formattedStartTime: '2:00 pm',
      });
    });

    it('formats trial session start time in the morning', () => {
      const result = formattedTrialSessionDetails({
        applicationContext,
        trialSession: {
          ...TRIAL_SESSION,
          startTime: '10:00',
        },
      });
      expect(result).toMatchObject({
        formattedStartTime: '10:00 am',
      });
    });

    it('formats trial session start time at noon', () => {
      const result = formattedTrialSessionDetails({
        applicationContext,
        trialSession: {
          ...TRIAL_SESSION,
          startTime: '12:00',
        },
      });
      expect(result).toMatchObject({
        formattedStartTime: '12:00 pm',
      });
    });
  });
  describe('formats trial session estimated end date', () => {
    it('does not format trial session estimated end date when estimatedEndDate is an invalid DateTime', () => {
      const result = formattedTrialSessionDetails({
        applicationContext,
        trialSession: {
          ...TRIAL_SESSION,
          estimatedEndDate: 'Am I an ISO8601 date string?',
        },
      });
      expect(result).toMatchObject({
        formattedEstimatedEndDate: 'Invalid DateTime',
      });
    });

    it('formats trial session estimated end date', () => {
      const result = formattedTrialSessionDetails({
        applicationContext,
        trialSession: {
          ...TRIAL_SESSION,
          estimatedEndDate: '2040-11-25T15:00:00.000Z',
        },
      });
      expect(result).toMatchObject({
        formattedEstimatedEndDate: '11/25/40',
      });
    });
  });

  it('displays swing session area if session is a swing session', () => {
    const result = formattedTrialSessionDetails({
      applicationContext,
      trialSession: {
        ...TRIAL_SESSION,
        swingSession: true,
        swingSessionId: '1234',
        swingSessionLocation: 'Honolulu, Hawaii',
      },
    });
    expect(result).toMatchObject({
      showSwingSession: true,
    });
  });

  it('formatCase identifies Small Lien/Levy, Lien/Levy, and Passport as high priority', () => {
    expect(
      formatCase({ applicationContext, caseItem: { docketNumberSuffix: 'W' } })
        .isDocketSuffixHighPriority,
    ).toBe(false);
    expect(
      formatCase({
        applicationContext,
        caseItem: {
          docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.SMALL_LIEN_LEVY,
        },
      }).isDocketSuffixHighPriority,
    ).toBe(true);
    expect(
      formatCase({
        applicationContext,
        caseItem: { docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.LIEN_LEVY },
      }).isDocketSuffixHighPriority,
    ).toBe(true);
    expect(
      formatCase({
        applicationContext,
        caseItem: { docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.PASSPORT },
      }).isDocketSuffixHighPriority,
    ).toBe(true);
    expect(
      applicationContext.getUtilities().setConsolidationFlagsForDisplay,
    ).toHaveBeenCalledTimes(4);
  });

  describe('comparing eligible cases', () => {
    it('prioritizes L and P', () => {
      const result = compareTrialSessionEligibleCases(
        {
          docketNumber: '101-19',
          docketNumberSuffix: '',
          docketNumberWithSuffix: '101-19',
          isDocketSuffixHighPriority: false,
        },
        {
          docketNumber: '101-19',
          docketNumberSuffix: 'P',
          docketNumberWithSuffix: '101-19P',
          isDocketSuffixHighPriority: true,
        },
      );
      expect(result).toBe(1);
    });

    it('compares eligible trial session cases sorting lien/levy and passport first', () => {
      const formattedEligibleCases = [
        {
          docketNumber: '101-19',
          docketNumberSuffix: '',
          docketNumberWithSuffix: '101-19',
        },
        {
          docketNumber: '101-19',
          docketNumberSuffix: 'P',
          docketNumberWithSuffix: '101-19P',
          isDocketSuffixHighPriority: true,
        },
      ];
      const result = formattedEligibleCases.sort(
        compareTrialSessionEligibleCases,
      );
      expect(result).toMatchObject([
        {
          docketNumber: '101-19',
          docketNumberSuffix: 'P',
          docketNumberWithSuffix: '101-19P',
          isDocketSuffixHighPriority: true,
        },
        {
          docketNumber: '101-19',
          docketNumberSuffix: '',
          docketNumberWithSuffix: '101-19',
        },
      ]);
    });

    it('compares eligible trial session cases sorting manually added cases first', () => {
      const formattedEligibleCases = [
        {
          // should be last
          docketNumber: '105-19',
          docketNumberSuffix: '',
          docketNumberWithSuffix: '105-19',
        },
        {
          // should be 3rd
          docketNumber: '101-19',
          docketNumberSuffix: 'L',
          docketNumberWithSuffix: '101-19L',
        },
        {
          // should be 1st
          docketNumber: '103-19',
          docketNumberSuffix: 'P',
          docketNumberWithSuffix: '103-19P',
          isManuallyAdded: true,
        },
        {
          // should be 2nd
          docketNumber: '104-19',
          docketNumberSuffix: '',
          docketNumberWithSuffix: '104-19',
          highPriority: true,
        },
      ];
      const result = formattedEligibleCases.sort(
        compareTrialSessionEligibleCases,
      );
      expect(result).toMatchObject([
        {
          docketNumber: '103-19',
          docketNumberSuffix: 'P',
          docketNumberWithSuffix: '103-19P',
          isManuallyAdded: true,
        },
        {
          docketNumber: '104-19',
          docketNumberSuffix: '',
          docketNumberWithSuffix: '104-19',
          highPriority: true,
        },
        {
          docketNumber: '101-19',
          docketNumberSuffix: 'L',
          docketNumberWithSuffix: '101-19L',
        },
        {
          docketNumber: '105-19',
          docketNumberSuffix: '',
          docketNumberWithSuffix: '105-19',
        },
      ]);
    });
  });

  it('formats docket numbers with suffixes and case caption names without postfix on eligible cases', () => {
    const result = formattedTrialSessionDetails({
      applicationContext,
      trialSession: {
        ...TRIAL_SESSION,
        eligibleCases: [
          MOCK_CASE,
          {
            ...MOCK_CASE,
            caseCaption: 'Daenerys Stormborn & Someone Else, Petitioners',
            docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.WHISTLEBLOWER,
            docketNumberWithSuffix: '101-18W',
          },
          {
            ...MOCK_CASE,
            caseCaption: undefined,
            docketNumber: '103-19',
            docketNumberWithSuffix: '103-19',
          },
          {
            ...MOCK_CASE,
            caseCaption: 'Marky Mark and The Funky Bunch, Petitioners',
            docketNumber: '799-19',
            docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.LIEN_LEVY,
            docketNumberWithSuffix: '799-19L', // high priority
          },
          {
            ...MOCK_CASE,
            caseCaption: 'Bob Dylan and the Traveling Wilburys, Petitioners',
            docketNumber: '122-20',
            docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.PASSPORT,
            docketNumberWithSuffix: '122-20P', // high priority
          },
        ],
      },
    });
    expect(
      applicationContext.getUtilities().setConsolidationFlagsForDisplay,
    ).toHaveBeenCalledTimes(5);
    expect(result.formattedEligibleCases.length).toEqual(5);
    expect(result.formattedEligibleCases).toMatchObject([
      {
        caseCaption: 'Marky Mark and The Funky Bunch, Petitioners',
        docketNumber: '799-19',
        docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.LIEN_LEVY,
        docketNumberWithSuffix: '799-19L',
        isDocketSuffixHighPriority: true,
      },
      {
        caseCaption: 'Bob Dylan and the Traveling Wilburys, Petitioners',
        docketNumber: '122-20',
        docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.PASSPORT,
        docketNumberWithSuffix: '122-20P',
        isDocketSuffixHighPriority: true,
      },
      {
        caseTitle: 'Test Petitioner',
        docketNumberWithSuffix: '101-18',
      },
      {
        caseTitle: 'Daenerys Stormborn & Someone Else',
        docketNumberWithSuffix: '101-18W',
      },
      {
        caseTitle: '',
        docketNumberWithSuffix: '103-19',
      },
    ]);
  });

  it('formats docket numbers with suffixes and case caption names without postfix on calendared cases and splits them by open and closed cases', () => {
    const result = formattedTrialSessionDetails({
      applicationContext,
      trialSession: {
        ...TRIAL_SESSION,
        calendaredCases: [
          MOCK_CASE,
          {
            ...MOCK_CASE,
            caseCaption: 'Daenerys Stormborn & Someone Else, Petitioners',
            docketNumber: '102-17',
            docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.WHISTLEBLOWER,
            docketNumberWithSuffix: '102-17W',
          },
          {
            ...MOCK_CASE,
            caseCaption: 'Someone Else, Petitioner',
            disposition: 'omg',
            docketNumber: '101-16',
            docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.SMALL,
            docketNumberWithSuffix: '101-16S',
            removedFromTrial: true,
            removedFromTrialDate: '2019-03-01T21:40:46.415Z',
          },
        ],
      },
    });
    expect(
      applicationContext.getUtilities().setConsolidationFlagsForDisplay,
    ).toHaveBeenCalledTimes(3);
    expect(result.allCases.length).toEqual(3);
    expect(result.allCases[0].docketNumberWithSuffix).toEqual('101-16S');
    expect(result.allCases[0].caseTitle).toEqual('Someone Else');
    expect(result.allCases[1].docketNumberWithSuffix).toEqual('102-17W');
    expect(result.allCases[1].caseTitle).toEqual(
      'Daenerys Stormborn & Someone Else',
    );
    expect(result.allCases[2].docketNumberWithSuffix).toEqual('101-18');
    expect(result.allCases[2].caseTitle).toEqual('Test Petitioner');

    expect(result.openCases.length).toEqual(2);
    expect(result.inactiveCases.length).toEqual(1);
    expect(result.openCases[0].docketNumberWithSuffix).toEqual('102-17W');
    expect(result.openCases[1].docketNumberWithSuffix).toEqual('101-18');
    expect(result.inactiveCases[0].docketNumberWithSuffix).toEqual('101-16S');
  });

  it('sorts calendared cases by docket number', () => {
    const result = formattedTrialSessionDetails({
      applicationContext,
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
    });
    expect(
      applicationContext.getUtilities().setConsolidationFlagsForDisplay,
    ).toHaveBeenCalledTimes(5);
    expect(result.allCases).toMatchObject([
      { docketNumber: '90-07' },
      { docketNumber: '500-17' },
      { docketNumber: '5000-17' },
      { docketNumber: '101-18' },
      { docketNumber: '102-19' },
    ]);
  });

  it('sets computedStatus to New if the session is not calendared', () => {
    const result = formattedTrialSessionDetails({
      applicationContext,
      trialSession: {
        ...TRIAL_SESSION,
        isCalendared: false,
      },
    });
    expect(result.computedStatus).toEqual(SESSION_STATUS_GROUPS.new);
  });

  it('sets computedStatus to Open if the session is calendared and calendaredCases contains open cases', () => {
    const result = formattedTrialSessionDetails({
      applicationContext,
      trialSession: {
        ...TRIAL_SESSION,
        calendaredCases: [
          {
            docketEntries: [],
            docketNumber: MOCK_CASE.docketNumber,
          },
        ],
        isCalendared: true,
      },
    });
    expect(result.computedStatus).toEqual(SESSION_STATUS_GROUPS.open);
  });

  it('sets computedStatus to Closed if the session is calendared and caseOrder contains only cases with removedFromTrial = true', () => {
    const result = formattedTrialSessionDetails({
      applicationContext,
      trialSession: {
        ...TRIAL_SESSION,
        caseOrder: [
          {
            docketNumber: MOCK_CASE.docketNumber,
            removedFromTrial: true,
          },
        ],
        isCalendared: true,
      },
    });
    expect(result.computedStatus).toEqual(SESSION_STATUS_GROUPS.closed);
  });
});
