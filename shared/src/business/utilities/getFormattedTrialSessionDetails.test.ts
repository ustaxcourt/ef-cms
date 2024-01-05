import { DOCKET_NUMBER_SUFFIXES } from '../entities/EntityConstants';
import { MOCK_CASE } from '../../../../shared/src/test/mockCase';
import { MOCK_TRIAL_REGULAR } from '@shared/test/mockTrial';
import { TrialSessionState } from '@web-client/presenter/state/trialSessionState';
import { applicationContext } from '../test/createTestApplicationContext';
import {
  formatCaseForTrialSession,
  getFormattedTrialSessionDetails,
} from './getFormattedTrialSessionDetails';
import { omit } from 'lodash';

describe('getFormattedTrialSessionDetails', () => {
  let TRIAL_SESSION: TrialSessionState;
  let mockCase: RawCase & {
    removedFromTrialDate?: string;
    removedFromTrial?: boolean;
  };

  beforeEach(() => {
    TRIAL_SESSION = {
      ...MOCK_TRIAL_REGULAR,
      caseOrder: [],
      city: 'Hartford',
      courtReporter: 'Test Court Reporter',
      estimatedEndDate: '2040-11-25T15:00:00.000Z',
      irsCalendarAdministrator: 'Test Calendar Admin',
      postalCode: '12345',
      startDate: '2019-11-25T15:00:00.000Z',
      startTime: '10:00',
      state: 'CT',
      term: 'Fall',
      termYear: '2019',
      trialClerk: {
        name: 'Test Trial Clerk',
        userId: 'eeeba5a9-b37b-439d-9201-033ec6e335wb',
      },
      trialLocation: 'Hartford, Connecticut',
    };
    mockCase = {
      ...MOCK_CASE,
      removedFromTrial: false,
    };
  });

  it('returns undefined if state.trialSession is undefined', () => {
    const options: any = { applicationContext };
    const result = getFormattedTrialSessionDetails(options);
    expect(result).toBeUndefined();
  });

  it('formats trial session when all fields have values', () => {
    const mockChambersPhoneNumber = '123-456-9088';
    TRIAL_SESSION.chambersPhoneNumber = mockChambersPhoneNumber;

    const result = getFormattedTrialSessionDetails({
      applicationContext,
      trialSession: TRIAL_SESSION,
    });

    expect(result).toMatchObject({
      formattedChambersPhoneNumber: mockChambersPhoneNumber,
      formattedCityStateZip: 'Hartford, CT 12345',
      formattedCourtReporter: 'Test Court Reporter',
      formattedIrsCalendarAdministrator: 'Test Calendar Admin',
      formattedJudge: 'Judge Yggdrasil',
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
    TRIAL_SESSION.irsCalendarAdministratorInfo = irsCalendarAdministratorInfo;

    const result = getFormattedTrialSessionDetails({
      applicationContext,
      trialSession: TRIAL_SESSION,
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
    TRIAL_SESSION = {
      ...omit(TRIAL_SESSION, [
        'courtReporter',
        'irsCalendarAdministrator',
        'judge',
        'trialClerk',
      ]),
      chambersPhoneNumber: undefined,
    };

    const result = getFormattedTrialSessionDetails({
      applicationContext,
      trialSession: TRIAL_SESSION,
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
    TRIAL_SESSION = {
      ...TRIAL_SESSION,
      alternateTrialClerkName,
      trialClerk: undefined,
    };

    const result = getFormattedTrialSessionDetails({
      applicationContext,
      trialSession: TRIAL_SESSION,
    });

    expect(result).toMatchObject({
      formattedTrialClerk: alternateTrialClerkName,
    });
  });

  describe('formats trial session start times', () => {
    it('formats trial session start time in the morning', () => {
      TRIAL_SESSION.startTime = '10:00';

      const result = getFormattedTrialSessionDetails({
        applicationContext,
        trialSession: TRIAL_SESSION,
      });

      expect(result).toMatchObject({
        formattedStartTime: '10:00 am',
      });
    });

    it('formats trial session start time at noon', () => {
      TRIAL_SESSION.startTime = '12:00';

      const result = getFormattedTrialSessionDetails({
        applicationContext,
        trialSession: TRIAL_SESSION,
      });
      expect(result).toMatchObject({
        formattedStartTime: '12:00 pm',
      });
    });
  });

  describe('formats trial session estimated end date', () => {
    it('does not format trial session estimated end date when estimatedEndDate is an invalid DateTime', () => {
      TRIAL_SESSION.estimatedEndDate = 'Am I an ISO8601 date string?';

      const result = getFormattedTrialSessionDetails({
        applicationContext,
        trialSession: TRIAL_SESSION,
      });

      expect(result).toMatchObject({
        formattedEstimatedEndDate: 'Invalid DateTime',
      });
    });

    it('formats trial session estimated end date', () => {
      TRIAL_SESSION.estimatedEndDate = '2040-11-25T15:00:00.000Z';

      const result = getFormattedTrialSessionDetails({
        applicationContext,
        trialSession: TRIAL_SESSION,
      });
      expect(result).toMatchObject({
        formattedEstimatedEndDate: '11/25/40',
      });
    });
  });

  it('displays swing session area if session is a swing session', () => {
    TRIAL_SESSION = {
      ...TRIAL_SESSION,
      swingSession: true,
      swingSessionId: '1234',
      swingSessionLocation: 'Honolulu, Hawaii',
    };

    const result = getFormattedTrialSessionDetails({
      applicationContext,
      trialSession: TRIAL_SESSION,
    });

    expect(result).toMatchObject({
      showSwingSession: true,
    });
  });

  it('formats docket numbers with suffixes and case caption names without postfix on calendared cases and splits them by open and closed cases', () => {
    TRIAL_SESSION = {
      ...TRIAL_SESSION,
      calendaredCases: [
        mockCase,
        {
          ...mockCase,
          caseCaption: 'Daenerys Stormborn & Someone Else, Petitioners',
          docketNumber: '102-17',
          docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.WHISTLEBLOWER,
          docketNumberWithSuffix: '102-17W',
        },
        {
          ...mockCase,
          caseCaption: 'Someone Else, Petitioner',
          docketNumber: '101-16',
          docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.SMALL,
          docketNumberWithSuffix: '101-16S',
          removedFromTrial: true,
          removedFromTrialDate: '2019-03-01T21:40:46.415Z',
        },
      ],
    };

    const result = getFormattedTrialSessionDetails({
      applicationContext,
      trialSession: TRIAL_SESSION,
    });

    expect(
      applicationContext.getUtilities().setConsolidationFlagsForDisplay,
    ).toHaveBeenCalledTimes(9);
    expect(result!.allCases.length).toEqual(3);
    expect(result!.allCases[0].docketNumberWithSuffix).toEqual('101-16S');
    expect(result!.allCases[0].caseTitle).toEqual('Someone Else');
    expect(result!.allCases[1].docketNumberWithSuffix).toEqual('102-17W');
    expect(result!.allCases[1].caseTitle).toEqual(
      'Daenerys Stormborn & Someone Else',
    );
    expect(result!.allCases[2].docketNumberWithSuffix).toEqual('101-18');
    expect(result!.allCases[2].caseTitle).toEqual('Test Petitioner');

    // expect(result.openCases.length).toEqual(2);
    expect(result!.inactiveCases.length).toEqual(1);
    expect(result!.openCases[0].docketNumberWithSuffix).toEqual('102-17W');
    expect(result!.openCases[1].docketNumberWithSuffix).toEqual('101-18');
    expect(result!.inactiveCases[0].docketNumberWithSuffix).toEqual('101-16S');
  });

  it('sorts calendared cases by docket number', () => {
    TRIAL_SESSION = {
      ...TRIAL_SESSION,
      calendaredCases: [
        mockCase,
        { ...mockCase, docketNumber: '102-19' },
        { ...mockCase, docketNumber: '5000-17' },
        { ...mockCase, docketNumber: '500-17' },
        { ...mockCase, docketNumber: '190-07' },
      ],
    };

    const result = getFormattedTrialSessionDetails({
      applicationContext,
      trialSession: TRIAL_SESSION,
    });

    expect(
      applicationContext.getUtilities().setConsolidationFlagsForDisplay,
    ).toHaveBeenCalledTimes(15);
    expect(result!.allCases).toMatchObject([
      { docketNumber: '190-07' },
      { docketNumber: '500-17' },
      { docketNumber: '5000-17' },
      { docketNumber: '101-18' },
      { docketNumber: '102-19' },
    ]);
  });

  it('should set the correct consolidated case flags', () => {
    TRIAL_SESSION = {
      ...TRIAL_SESSION,
      calendaredCases: [
        { ...mockCase, docketNumber: '101-11' },
        { ...mockCase, docketNumber: '102-19', removedFromTrial: true },
        { ...mockCase, docketNumber: '5000-17' },
        {
          ...mockCase,
          docketNumber: '500-17',
          leadDocketNumber: '500-17',
          removedFromTrial: true,
        },
        { ...mockCase, docketNumber: '501-17', leadDocketNumber: '500-17' },
      ],
    };

    const result = getFormattedTrialSessionDetails({
      applicationContext,
      trialSession: TRIAL_SESSION,
    });

    expect(result!.openCases).toMatchObject([
      expect.objectContaining({ docketNumber: '101-11' }),
      expect.objectContaining({
        consolidatedIconTooltipText: 'Consolidated case',
        docketNumber: '501-17',
        inConsolidatedGroup: true,
      }),
      expect.objectContaining({ docketNumber: '5000-17' }),
    ]);
    expect(result!.openCases[1].shouldIndent).toBeFalsy();
    expect(result!.inactiveCases).toMatchObject([
      expect.objectContaining({
        consolidatedIconTooltipText: 'Lead case',
        docketNumber: '500-17',
        isLeadCase: true,
      }),
      expect.objectContaining({ docketNumber: '102-19' }),
    ]);
    expect(result!.allCases).toMatchObject([
      expect.objectContaining({ docketNumber: '101-11' }),
      expect.objectContaining({ docketNumber: '500-17' }),
      expect.objectContaining({ docketNumber: '501-17' }),
      expect.objectContaining({ docketNumber: '5000-17' }),
      expect.objectContaining({ docketNumber: '102-19' }),
    ]);
  });
});

describe('formatCaseForTrialSession', () => {
  let caseItem: {
    docketNumber: string;
    entityName: 'Case';
    status: 'New';
    docketNumberSuffix?: string;
  };

  beforeEach(() => {
    caseItem = {
      docketNumber: '101-20',
      entityName: 'Case',
      status: 'New',
    };
  });
  it('identifies Small Lien/Levy, Lien/Levy, and Passport as high priority', () => {
    caseItem.docketNumberSuffix = 'W';
    expect(
      formatCaseForTrialSession({
        applicationContext,
        caseItem,
      }).isDocketSuffixHighPriority,
    ).toBe(false);

    caseItem.docketNumberSuffix = DOCKET_NUMBER_SUFFIXES.SMALL_LIEN_LEVY;
    expect(
      formatCaseForTrialSession({
        applicationContext,
        caseItem,
      }).isDocketSuffixHighPriority,
    ).toBe(true);

    caseItem.docketNumberSuffix = DOCKET_NUMBER_SUFFIXES.LIEN_LEVY;
    expect(
      formatCaseForTrialSession({
        applicationContext,
        caseItem,
      }).isDocketSuffixHighPriority,
    ).toBe(true);

    caseItem.docketNumberSuffix = DOCKET_NUMBER_SUFFIXES.PASSPORT;
    expect(
      formatCaseForTrialSession({
        applicationContext,
        caseItem,
      }).isDocketSuffixHighPriority,
    ).toBe(true);

    expect(
      applicationContext.getUtilities().setConsolidationFlagsForDisplay,
    ).toHaveBeenCalledTimes(4);
  });
});
