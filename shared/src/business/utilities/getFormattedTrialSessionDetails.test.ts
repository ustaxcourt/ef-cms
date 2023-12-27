import { DOCKET_NUMBER_SUFFIXES } from '../entities/EntityConstants';
import { MOCK_CASE } from '../../../../shared/src/test/mockCase';
import { applicationContext } from '../test/createTestApplicationContext';
import {
  formatCaseForTrialSession,
  getFormattedTrialSessionDetails,
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
    const options: any = { applicationContext };
    const result = getFormattedTrialSessionDetails(options);
    expect(result).toBeUndefined();
  });

  it('formats trial session when all fields have values', () => {
    const mockChambersPhoneNumber = '1234567';

    const result = getFormattedTrialSessionDetails({
      applicationContext,
      trialSession: {
        ...TRIAL_SESSION,
        chambersPhoneNumber: mockChambersPhoneNumber,
      },
    });

    expect(result).toMatchObject({
      formattedChambersPhoneNumber: mockChambersPhoneNumber,
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

  it('should format trial session to include irsCalendarAdministratorInfo', () => {
    const irsCalendarAdministratorInfo = {
      email: 'TEST_EMAIL',
      name: 'TEST_NAME',
      phone: 'TEST_PHONE',
    };
    const result = getFormattedTrialSessionDetails({
      applicationContext,
      trialSession: {
        ...TRIAL_SESSION,
        irsCalendarAdministratorInfo,
      },
    });

    expect(result).toMatchObject({
      formattedIrsCalendarAdministratorInfo: irsCalendarAdministratorInfo,
    });
  });

  it('formats trial session when address fields are empty', () => {
    let result = getFormattedTrialSessionDetails({
      applicationContext,
      trialSession: omit(TRIAL_SESSION, ['city', 'state', 'postalCode']),
    });
    expect(result).toMatchObject({
      formattedCityStateZip: '',
      noLocationEntered: true,
    });

    result = getFormattedTrialSessionDetails({
      applicationContext,
      trialSession: omit(TRIAL_SESSION, ['city']),
    });
    expect(result).toMatchObject({
      formattedCityStateZip: 'CT 12345',
      noLocationEntered: false,
    });

    result = getFormattedTrialSessionDetails({
      applicationContext,
      trialSession: omit(TRIAL_SESSION, ['state']),
    });
    expect(result).toMatchObject({
      formattedCityStateZip: 'Hartford, 12345',
      noLocationEntered: false,
    });

    result = getFormattedTrialSessionDetails({
      applicationContext,
      trialSession: omit(TRIAL_SESSION, ['state']),
    });
    expect(result).toMatchObject({
      formattedCityStateZip: 'Hartford, 12345',
      noLocationEntered: false,
    });

    result = getFormattedTrialSessionDetails({
      applicationContext,
      trialSession: omit(TRIAL_SESSION, ['postalCode']),
    });
    expect(result).toMatchObject({
      formattedCityStateZip: 'Hartford, CT',
      noLocationEntered: false,
    });
  });

  it('formats trial session when session assignments are empty', () => {
    const result = getFormattedTrialSessionDetails({
      applicationContext,
      trialSession: {
        ...omit(TRIAL_SESSION, [
          'courtReporter',
          'irsCalendarAdministrator',
          'judge',
          'trialClerk',
        ]),
        chambersPhoneNumber: undefined,
      },
    });
    expect(result).toMatchObject({
      formattedChambersPhoneNumber: 'No phone number',
      formattedCourtReporter: 'Not assigned',
      formattedIrsCalendarAdministrator: 'Not assigned',
      formattedJudge: 'Not assigned',
      formattedTrialClerk: 'Not assigned',
    });
  });

  it('formats trial session when trial clerk is empty and alternate trial clerk name is populated', () => {
    const alternateTrialClerkName = 'Incredible Hulk';
    const testTrialSession = {
      ...TRIAL_SESSION,
      alternateTrialClerkName,
      trialClerk: {},
    };
    const result = getFormattedTrialSessionDetails({
      applicationContext,
      trialSession: testTrialSession,
    });
    expect(result).toMatchObject({
      formattedTrialClerk: alternateTrialClerkName,
    });
  });

  describe('formats trial session start times', () => {
    it('formats trial session start time', () => {
      const result = getFormattedTrialSessionDetails({
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
      const result = getFormattedTrialSessionDetails({
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
      const result = getFormattedTrialSessionDetails({
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
      const result = getFormattedTrialSessionDetails({
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
      const result = getFormattedTrialSessionDetails({
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
    const result = getFormattedTrialSessionDetails({
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
      formatCaseForTrialSession({
        applicationContext,
        caseItem: { docketNumberSuffix: 'W' },
      }).isDocketSuffixHighPriority,
    ).toBe(false);
    expect(
      formatCaseForTrialSession({
        applicationContext,
        caseItem: {
          docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.SMALL_LIEN_LEVY,
        },
      }).isDocketSuffixHighPriority,
    ).toBe(true);
    expect(
      formatCaseForTrialSession({
        applicationContext,
        caseItem: { docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.LIEN_LEVY },
      }).isDocketSuffixHighPriority,
    ).toBe(true);
    expect(
      formatCaseForTrialSession({
        applicationContext,
        caseItem: { docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.PASSPORT },
      }).isDocketSuffixHighPriority,
    ).toBe(true);
    expect(
      applicationContext.getUtilities().setConsolidationFlagsForDisplay,
    ).toHaveBeenCalledTimes(4);
  });

  it('formats docket numbers with suffixes and case caption names without postfix on calendared cases and splits them by open and closed cases', () => {
    const result = getFormattedTrialSessionDetails({
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
    ).toHaveBeenCalledTimes(9);
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
    const result = getFormattedTrialSessionDetails({
      applicationContext,
      trialSession: {
        ...TRIAL_SESSION,
        calendaredCases: [
          MOCK_CASE,
          { ...MOCK_CASE, docketNumber: '102-19' },
          { ...MOCK_CASE, docketNumber: '5000-17' },
          { ...MOCK_CASE, docketNumber: '500-17' },
          { ...MOCK_CASE, docketNumber: '190-07' },
        ],
      },
    });
    expect(
      applicationContext.getUtilities().setConsolidationFlagsForDisplay,
    ).toHaveBeenCalledTimes(15);
    expect(result.allCases).toMatchObject([
      { docketNumber: '190-07' },
      { docketNumber: '500-17' },
      { docketNumber: '5000-17' },
      { docketNumber: '101-18' },
      { docketNumber: '102-19' },
    ]);
  });

  it('should set the correct consolidated case flags', () => {
    const result = getFormattedTrialSessionDetails({
      applicationContext,
      trialSession: {
        ...TRIAL_SESSION,
        calendaredCases: [
          { ...MOCK_CASE, docketNumber: '101-11' },
          { ...MOCK_CASE, docketNumber: '102-19', removedFromTrial: true },
          { ...MOCK_CASE, docketNumber: '5000-17' },
          {
            ...MOCK_CASE,
            docketNumber: '500-17',
            leadDocketNumber: '500-17',
            removedFromTrial: true,
          },
          { ...MOCK_CASE, docketNumber: '501-17', leadDocketNumber: '500-17' },
        ],
      },
    });
    expect(result.openCases).toMatchObject([
      expect.objectContaining({ docketNumber: '101-11' }),
      expect.objectContaining({
        consolidatedIconTooltipText: 'Consolidated case',
        docketNumber: '501-17',
        inConsolidatedGroup: true,
      }),
      expect.objectContaining({ docketNumber: '5000-17' }),
    ]);
    expect(result.openCases[1].shouldIndent).toBeFalsy();
    expect(result.inactiveCases).toMatchObject([
      expect.objectContaining({
        consolidatedIconTooltipText: 'Lead case',
        docketNumber: '500-17',
        isLeadCase: true,
      }),
      expect.objectContaining({ docketNumber: '102-19' }),
    ]);
    expect(result.allCases).toMatchObject([
      expect.objectContaining({ docketNumber: '101-11' }),
      expect.objectContaining({ docketNumber: '500-17' }),
      expect.objectContaining({ docketNumber: '501-17' }),
      expect.objectContaining({ docketNumber: '5000-17' }),
      expect.objectContaining({ docketNumber: '102-19' }),
    ]);
  });
});
