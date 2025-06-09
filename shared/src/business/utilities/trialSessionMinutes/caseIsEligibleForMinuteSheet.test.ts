import { caseIsEligibleForMinuteSheet } from './caseIsEligibleForMinuteSheet';
import { MOCK_CASE } from '@shared/test/mockCase';
import { MOCK_TRIAL_REGULAR } from '@shared/test/mockTrial';
import { CASE_STATUS_TYPES } from '@shared/business/entities/EntityConstants';

describe('caseIsEligibleForMinuteSheet', () => {
  it('should return true when case is not part of consolidated group and the trial session has a start date', () => {
    const mockCase = {
      ...MOCK_CASE,
      leadDocketNumber: undefined,
      docketNumber: '123-45',
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
    const mockTrialSession = {
      ...MOCK_TRIAL_REGULAR,
      isCalendared: false,
    };

    const result = caseIsEligibleForMinuteSheet(MOCK_CASE, mockTrialSession);

    expect(result).toBe(false);
  });

  it('should return false when case is closed', () => {
    const mockCase = {
      ...MOCK_CASE,
      status: CASE_STATUS_TYPES.closed,
      docketNumber: '123-45',
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
