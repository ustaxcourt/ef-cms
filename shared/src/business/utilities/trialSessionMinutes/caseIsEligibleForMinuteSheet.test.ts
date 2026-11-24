import {
  caseIsEligibleForMinuteSheet,
  unscheduledCaseIsEligibleForMinuteSheet,
} from './caseIsEligibleForMinuteSheet';
import { MOCK_CASE } from '@shared/test/mockCase';
import { MOCK_TRIAL_REGULAR } from '@shared/test/mockTrial';
import {
  CASE_STATUS_TYPES,
  TRIAL_SESSION_PROCEEDING_TYPES,
} from '@shared/business/entities/EntityConstants';

describe('caseIsEligibleForMinuteSheet', () => {
  it('should return true when case is not part of consolidated group and the trial session has a start date', () => {
    const mockCase = {
      ...MOCK_CASE,
      leadDocketNumber: undefined,
      docketNumber: '123-45',
      addedToSessionAt: '2018-03-01T21:40:46.415Z',
      isHearing: false,
      isManuallyAdded: false,
      removedFromTrial: false,
    };
    const mockTrialSession = {
      ...MOCK_TRIAL_REGULAR,
      isCalendared: true,
      startDate: '2020-02-01',
      startTime: '10:00',
    };

    const result = caseIsEligibleForMinuteSheet(mockCase, mockTrialSession);

    expect(result).toBe(true);
  });

  it('should return true when case is not part of consolidated group and the trial session does not have a start date', () => {
    const mockCase = {
      ...MOCK_CASE,
      leadDocketNumber: undefined,
      docketNumber: '123-45',
      addedToSessionAt: '2018-03-01T21:40:46.415Z',
      isHearing: false,
      isManuallyAdded: false,
      removedFromTrial: false,
    };
    const mockTrialSession = {
      ...MOCK_TRIAL_REGULAR,
      isCalendared: true,
      startTime: undefined,
    };

    const result = caseIsEligibleForMinuteSheet(mockCase, mockTrialSession);

    expect(result).toBe(true);
  });

  it('should return false when trial session is not calendared', () => {
    const mockCase = {
      ...MOCK_CASE,
      addedToSessionAt: '2018-03-01T21:40:46.415Z',
      isHearing: false,
      isManuallyAdded: false,
      removedFromTrial: false,
    };
    const mockTrialSession = {
      ...MOCK_TRIAL_REGULAR,
      isCalendared: false,
    };

    const result = caseIsEligibleForMinuteSheet(mockCase, mockTrialSession);

    expect(result).toBe(false);
  });

  it('should return false when case is closed', () => {
    const mockCase = {
      ...MOCK_CASE,
      status: CASE_STATUS_TYPES.closed,
      docketNumber: '123-45',
      addedToSessionAt: '2018-03-01T21:40:46.415Z',
      isHearing: false,
      isManuallyAdded: false,
      removedFromTrial: false,
    };
    const mockTrialSession = {
      ...MOCK_TRIAL_REGULAR,
      isCalendared: true,
    };

    const result = caseIsEligibleForMinuteSheet(mockCase, mockTrialSession);

    expect(result).toBe(false);
  });

  it('should return false when case is part of consolidated group but not lead case', () => {
    const mockCase = {
      ...MOCK_CASE,
      docketNumber: '123-45',
      leadDocketNumber: '123-44',
      addedToSessionAt: '2018-03-01T21:40:46.415Z',
      isHearing: false,
      isManuallyAdded: false,
      removedFromTrial: false,
    };
    const mockTrialSession = {
      ...MOCK_TRIAL_REGULAR,
      isCalendared: true,
    };

    const result = caseIsEligibleForMinuteSheet(mockCase, mockTrialSession);

    expect(result).toBe(false);
  });

  it('should return true when case is part of consolidated group and is lead case', () => {
    const mockCase = {
      ...MOCK_CASE,
      docketNumber: '123-45',
      leadDocketNumber: '123-45',
      addedToSessionAt: '2018-03-01T21:40:46.415Z',
      isHearing: false,
      isManuallyAdded: false,
      removedFromTrial: false,
    };
    const mockTrialSession = {
      ...MOCK_TRIAL_REGULAR,
      isCalendared: true,
    };

    const result = caseIsEligibleForMinuteSheet(mockCase, mockTrialSession);

    expect(result).toBe(true);
  });

  it('should return false when case was removed before trial started', () => {
    const mockCase = {
      ...MOCK_CASE,
      removedFromTrialDate: '2020-01-01',
      addedToSessionAt: '2018-03-01T21:40:46.415Z',
      isHearing: false,
      isManuallyAdded: false,
      removedFromTrial: true,
    };
    const mockTrialSession = {
      ...MOCK_TRIAL_REGULAR,
      isCalendared: true,
      startDate: '2020-02-01',
      startTime: '10:00',
    };

    const result = caseIsEligibleForMinuteSheet(mockCase, mockTrialSession);

    expect(result).toBe(false);
  });

  it('should return true when case was removed after trial started', () => {
    const mockCase = {
      ...MOCK_CASE,
      removedFromTrialDate: '2020-02-02',
      addedToSessionAt: '2018-03-01T21:40:46.415Z',
      isHearing: false,
      isManuallyAdded: false,
      removedFromTrial: true,
    };
    const mockTrialSession = {
      ...MOCK_TRIAL_REGULAR,
      isCalendared: true,
      startDate: '2020-02-01',
      startTime: '10:00',
    };

    const result = caseIsEligibleForMinuteSheet(mockCase, mockTrialSession);

    expect(result).toBe(true);
  });
});

describe('unscheduledCaseIsEligibleForMinuteSheet', () => {
  it('should return true when unscheduled case is eligible (not a non-lead consolidated case)', () => {
    const mockCase = {
      ...MOCK_CASE,
      leadDocketNumber: undefined,
      docketNumber: '123-45',
    };
    const mockTrialSession = {
      ...MOCK_TRIAL_REGULAR,
      isCalendared: true,
    };

    const result = unscheduledCaseIsEligibleForMinuteSheet(
      mockCase,
      mockTrialSession,
    );

    expect(result).toBe(true);
  });

  it('should return false when trial session is not calendared', () => {
    const mockCase = {
      ...MOCK_CASE,
      leadDocketNumber: undefined,
      docketNumber: '123-45',
    };
    const mockTrialSession = {
      ...MOCK_TRIAL_REGULAR,
      isCalendared: false,
    };

    const result = unscheduledCaseIsEligibleForMinuteSheet(
      mockCase,
      mockTrialSession,
    );

    expect(result).toBe(false);
  });

  it('should return true when case is closed (closed cases are allowed for unscheduled minute sheets)', () => {
    const mockCase = {
      ...MOCK_CASE,
      status: CASE_STATUS_TYPES.closed,
      docketNumber: '123-45',
    };
    const mockTrialSession = {
      ...MOCK_TRIAL_REGULAR,
      isCalendared: true,
    };

    const result = unscheduledCaseIsEligibleForMinuteSheet(
      mockCase,
      mockTrialSession,
    );

    expect(result).toBe(true);
  });

  it('should return false when case is part of consolidated group but not lead case', () => {
    const mockCase = {
      ...MOCK_CASE,
      docketNumber: '123-45',
      leadDocketNumber: '123-44',
    };
    const mockTrialSession = {
      ...MOCK_TRIAL_REGULAR,
      isCalendared: true,
    };

    const result = unscheduledCaseIsEligibleForMinuteSheet(
      mockCase,
      mockTrialSession,
    );

    expect(result).toBe(false);
  });

  it('should return true when case is part of consolidated group and is lead case', () => {
    const mockCase = {
      ...MOCK_CASE,
      docketNumber: '123-45',
      leadDocketNumber: '123-45',
    };
    const mockTrialSession = {
      ...MOCK_TRIAL_REGULAR,
      isCalendared: true,
    };

    const result = unscheduledCaseIsEligibleForMinuteSheet(
      mockCase,
      mockTrialSession,
    );

    expect(result).toBe(true);
  });

  it('should NOT check removedFromTrialDate for unscheduled cases (since they are not calendared)', () => {
    const mockCase = {
      ...MOCK_CASE,
      docketNumber: '123-45',
      leadDocketNumber: undefined,
      removedFromTrialDate: '2020-01-01',
    };
    const mockTrialSession = {
      ...MOCK_TRIAL_REGULAR,
      isCalendared: true,
      startDate: '2020-02-01',
      startTime: '10:00',
    };

    const result = unscheduledCaseIsEligibleForMinuteSheet(
      mockCase,
      mockTrialSession,
    );

    expect(result).toBe(true);
  });
});

describe('minute sheet eligibility for Reporting sessions', () => {
  const eligibleCase = {
    ...MOCK_CASE,
    addedToSessionAt: '2018-03-01T21:40:46.415Z',
    docketNumber: '123-45',
    isHearing: false,
    isManuallyAdded: false,
    leadDocketNumber: undefined,
    removedFromTrial: false,
  };
  const calendaredReportingSession = {
    ...MOCK_TRIAL_REGULAR,
    isCalendared: true,
    proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.reporting,
    startTime: undefined,
  };

  it('should return false for an otherwise eligible case on a calendared Reporting session', () => {
    expect(
      caseIsEligibleForMinuteSheet(eligibleCase, calendaredReportingSession),
    ).toBe(false);
  });

  it('should return false for an otherwise eligible unscheduled case on a calendared Reporting session', () => {
    expect(
      unscheduledCaseIsEligibleForMinuteSheet(
        eligibleCase,
        calendaredReportingSession,
      ),
    ).toBe(false);
  });

  it.each([
    TRIAL_SESSION_PROCEEDING_TYPES.inPerson,
    TRIAL_SESSION_PROCEEDING_TYPES.remote,
  ])(
    'should return true for the same case when the calendared session is %s',
    proceedingType => {
      const session = { ...calendaredReportingSession, proceedingType };

      expect(caseIsEligibleForMinuteSheet(eligibleCase, session)).toBe(true);
      expect(
        unscheduledCaseIsEligibleForMinuteSheet(eligibleCase, session),
      ).toBe(true);
    },
  );
});
