import {
  DOCKET_NUMBER_SUFFIXES,
  SESSION_STATUS_GROUPS,
} from '../entities/EntityConstants';
import { MOCK_CASE } from '../../../../shared/src/test/mockCase';
import { applicationContext } from '../../../../web-client/src/applicationContext';
import {
  compareTrialSessionEligibleCases,
  formatCase,
  formattedTrialSessionDetails,
  getTrialSessionStatus,
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
      trialSession: {
        ...TRIAL_SESSION,
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

  it('formats trial session when address fields are empty', () => {
    let result = formattedTrialSessionDetails({
      applicationContext,
      trialSession: {
        ...omit(TRIAL_SESSION, ['city', 'state', 'postalCode']),
      },
    });
    expect(result).toMatchObject({
      formattedCityStateZip: '',
      noLocationEntered: true,
    });

    result = formattedTrialSessionDetails({
      applicationContext,
      trialSession: {
        ...omit(TRIAL_SESSION, ['city']),
      },
    });
    expect(result).toMatchObject({
      formattedCityStateZip: 'CT 12345',
      noLocationEntered: false,
    });

    result = formattedTrialSessionDetails({
      applicationContext,
      trialSession: {
        ...omit(TRIAL_SESSION, ['state']),
      },
    });
    expect(result).toMatchObject({
      formattedCityStateZip: 'Hartford, 12345',
      noLocationEntered: false,
    });

    result = formattedTrialSessionDetails({
      applicationContext,

      trialSession: {
        ...omit(TRIAL_SESSION, ['state']),
      },
    });
    expect(result).toMatchObject({
      formattedCityStateZip: 'Hartford, 12345',
      noLocationEntered: false,
    });

    result = formattedTrialSessionDetails({
      applicationContext,
      trialSession: {
        ...omit(TRIAL_SESSION, ['postalCode']),
      },
    });
    expect(result).toMatchObject({
      formattedCityStateZip: 'Hartford, CT',
      noLocationEntered: false,
    });
  });

  it('formats trial session when session assignments are empty', () => {
    let result = formattedTrialSessionDetails({
      applicationContext,
      trialSession: {
        ...omit(TRIAL_SESSION, [
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

  it('formats trial session start time', () => {
    let result = formattedTrialSessionDetails({
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

  it('displays swing session area if session is a swing session', () => {
    let result = formattedTrialSessionDetails({
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
      expect(result[0]).toMatchObject({
        docketNumber: '103-19',
        docketNumberSuffix: 'P',
        docketNumberWithSuffix: '103-19P',
        isManuallyAdded: true,
      });
      expect(result[1]).toMatchObject({
        // should be 2nd
        docketNumber: '104-19',
        docketNumberSuffix: '',
        docketNumberWithSuffix: '104-19',
        highPriority: true,
      });
      expect(result[2]).toMatchObject({
        // should be 3rd
        docketNumber: '101-19',
        docketNumberSuffix: 'L',
        docketNumberWithSuffix: '101-19L',
      });
      expect(result[3]).toMatchObject({
        // should be last
        docketNumber: '105-19',
        docketNumberSuffix: '',
        docketNumberWithSuffix: '105-19',
      });
    });
  });

  it('formats docket numbers with suffixes and case caption names without postfix on eligible cases', () => {
    let result = formattedTrialSessionDetails({
      applicationContext,
      trialSession: {
        ...TRIAL_SESSION,
        eligibleCases: [
          MOCK_CASE,
          {
            ...MOCK_CASE,
            caseCaption: 'Daenerys Stormborn & Someone Else, Petitioners',
            docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.WHISTLEBLOWER,
          },
          {
            ...MOCK_CASE,
            caseCaption: undefined,
            docketNumber: '103-19',
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
    expect(result.formattedEligibleCases.length).toEqual(5);

    expect(result.formattedEligibleCases[0]).toMatchObject({
      caseCaption: 'Marky Mark and The Funky Bunch, Petitioners',
      docketNumber: '799-19',
      docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.LIEN_LEVY,
      docketNumberWithSuffix: '799-19L',
      isDocketSuffixHighPriority: true,
    });

    expect(result.formattedEligibleCases[1]).toMatchObject({
      caseCaption: 'Bob Dylan and the Traveling Wilburys, Petitioners',
      docketNumber: '122-20',
      docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.PASSPORT,
      docketNumberWithSuffix: '122-20P',
      isDocketSuffixHighPriority: true,
    });

    expect(result.formattedEligibleCases[2]).toMatchObject({
      caseTitle: 'Test Petitioner',
      docketNumberWithSuffix: '101-18',
    });
    expect(result.formattedEligibleCases[3]).toMatchObject({
      caseTitle: 'Daenerys Stormborn & Someone Else',
      docketNumberWithSuffix: '101-18W',
    });

    expect(result.formattedEligibleCases[4]).toMatchObject({
      caseTitle: '',
      docketNumberWithSuffix: '103-19',
    });
  });

  it('formats docket numbers with suffixes and case caption names without postfix on calendared cases and splits them by open and closed cases', () => {
    let result = formattedTrialSessionDetails({
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
          },
          {
            ...MOCK_CASE,
            caseCaption: 'Someone Else, Petitioner',
            disposition: 'omg',
            docketNumber: '101-16',
            docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.SMALL,
            removedFromTrial: true,
            removedFromTrialDate: '2019-03-01T21:40:46.415Z',
          },
        ],
      },
    });
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
    let result = formattedTrialSessionDetails({
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
    expect(result.allCases).toMatchObject([
      { docketNumber: '90-07' },
      { docketNumber: '500-17' },
      { docketNumber: '5000-17' },
      { docketNumber: '101-18' },
      { docketNumber: '102-19' },
    ]);
  });

  it('sets computedStatus to New if the session is not calendared', () => {
    let result = formattedTrialSessionDetails({
      applicationContext,
      trialSession: {
        ...TRIAL_SESSION,
        isCalendared: false,
      },
    });
    expect(result.computedStatus).toEqual(SESSION_STATUS_GROUPS.new);
  });

  it('sets computedStatus to Open if the session is calendared and calendaredCases contains open cases', () => {
    let result = formattedTrialSessionDetails({
      applicationContext,
      trialSession: {
        ...TRIAL_SESSION,
        calendaredCases: [
          {
            docketNumber: MOCK_CASE.docketNumber,
          },
        ],
        isCalendared: true,
      },
    });
    expect(result.computedStatus).toEqual(SESSION_STATUS_GROUPS.open);
  });

  it('sets computedStatus to Closed if the session is calendared and caseOrder contains only cases with removedFromTrial = true', () => {
    let result = formattedTrialSessionDetails({
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

  describe('getTrialSessionStatus', () => {
    it('returns `Closed` when all trial session cases are inactive / removed from trial', () => {
      const session = {
        caseOrder: [
          { docketNumber: '123-19', removedFromTrial: true },
          { docketNumber: '234-19', removedFromTrial: true },
        ],
      };

      const results = getTrialSessionStatus({ applicationContext, session });

      expect(results).toEqual(SESSION_STATUS_GROUPS.closed);
    });

    it('returns `Open` when a trial session is calendared and does not meet conditions for `Closed` status', () => {
      const session = {
        caseOrder: [
          { docketNumber: '123-19' },
          { docketNumber: '234-19', removedFromTrial: true },
        ],
        isCalendared: true,
      };

      const results = getTrialSessionStatus({ applicationContext, session });

      expect(results).toEqual(SESSION_STATUS_GROUPS.open);
    });

    it('returns `New` when a trial session is calendared and does not meet conditions for `Closed` status', () => {
      const session = {
        caseOrder: [
          { docketNumber: '123-19' },
          { docketNumber: '234-19', removedFromTrial: true },
        ],
        isCalendared: false,
      };

      const results = getTrialSessionStatus({ applicationContext, session });

      expect(results).toEqual(SESSION_STATUS_GROUPS.new);
    });
  });
});
