import { shouldGenerateNoticeOfChangeTrialStartDate } from '@shared/business/utilities/trialSession/shouldGenerateNoticeOfChangeTrialStartDate';
import { MOCK_TRIAL_INPERSON } from '@shared/test/mockTrial';

describe('shouldGenerateNoticeOfTrialStartDateChange', () => {
  it('should return false if current trial session is not calendared and trial start date has not changed', () => {
    const currentTrialSession = {
      ...MOCK_TRIAL_INPERSON,
      isCalendared: false,
      startDate: '2026-04-06T05:00:00.000Z',
    }

    const updatedTrialSession = {
      ...MOCK_TRIAL_INPERSON,
      isCalendared: true,
      startDate: '2026-04-06T05:00:00.000Z',
    }

    const result = shouldGenerateNoticeOfChangeTrialStartDate(
      currentTrialSession,
      updatedTrialSession,
    );

    expect(result).toEqual(false);
  });

  it('should return false if updated trial session is not calendared and trial start date has not changed', () => {
    const currentTrialSession = {
      ...MOCK_TRIAL_INPERSON,
      isCalendared: true,
      startDate: '2026-04-06T05:00:00.000Z',
    };

    const updatedTrialSession = {
      ...MOCK_TRIAL_INPERSON,
      isCalendared: false,
      startDate: '2026-04-06T05:00:00.000Z',
    };

    const result = shouldGenerateNoticeOfChangeTrialStartDate(
      currentTrialSession,
      updatedTrialSession,
    );

    expect(result).toEqual(false);
  });

  it('should return false if both current and updated trial session are calendared and trial start date has not changed', () => {
    const currentTrialSession = {
      ...MOCK_TRIAL_INPERSON,
      isCalendared: true,
      startDate: '2026-04-06T05:00:00.000Z',
    };

    const updatedTrialSession = {
      ...MOCK_TRIAL_INPERSON,
      isCalendared: true,
      startDate: '2026-04-06T05:00:00.000Z',
    };

    const result = shouldGenerateNoticeOfChangeTrialStartDate(
      currentTrialSession,
      updatedTrialSession,
    );

    expect(result).toEqual(false);
  });

  it('should return false if updated and current trial session is not calendared and trial start date has changed', () => {
    const currentTrialSession = {
      ...MOCK_TRIAL_INPERSON,
      isCalendared: false,
      startDate: '2026-04-06T05:00:00.000Z',
    };

    const updatedTrialSession = {
      ...MOCK_TRIAL_INPERSON,
      isCalendared: false,
      startDate: '2026-04-13T05:00:00.000Z',
    };

    const result = shouldGenerateNoticeOfChangeTrialStartDate(
      currentTrialSession,
      updatedTrialSession,
    );

    expect(result).toEqual(false);
  });

  it('should return true if both current and updated trial session are calendared and trial start date has changed', () => {
    const currentTrialSession = {
      ...MOCK_TRIAL_INPERSON,
      isCalendared: true,
      startDate: '2026-04-06T05:00:00.000Z',
    };

    const updatedTrialSession = {
      ...MOCK_TRIAL_INPERSON,
      isCalendared: true,
      startDate: '2026-04-13T05:00:00.000Z',
    };

    const result = shouldGenerateNoticeOfChangeTrialStartDate(
      currentTrialSession,
      updatedTrialSession,
    );

    expect(result).toEqual(true);
  });
});
