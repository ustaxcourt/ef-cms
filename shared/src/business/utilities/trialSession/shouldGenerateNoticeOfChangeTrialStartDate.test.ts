import { shouldGenerateNoticeOfChangeTrialStartDate } from '@shared/business/utilities/trialSession/shouldGenerateNoticeOfChangeTrialStartDate';
import { MOCK_TRIAL_INPERSON } from '@shared/test/mockTrial';
import { TRIAL_SESSION_PROCEEDING_TYPES } from '@shared/business/entities/EntityConstants';

describe('shouldGenerateNoticeOfTrialStartDateChange', () => {
  it('should return false if current trial session is not calendared and trial start date has not changed', () => {
    const currentTrialSession = {
      ...MOCK_TRIAL_INPERSON,
      isCalendared: false,
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
  it('should return true if both current and updated trial session are calendared, are not Reporting sessions, and the trial start date has changed', () => {
    const result = shouldGenerateNoticeOfChangeTrialStartDate(
      {
        ...MOCK_TRIAL_INPERSON,
        isCalendared: true,
        startDate: '2026-04-06T05:00:00.000Z',
      },
      {
        ...MOCK_TRIAL_INPERSON,
        isCalendared: true,
        startDate: '2026-04-13T05:00:00.000Z',
      },
    );

    expect(result).toEqual(true);
  });

  it('should return false if a calendared Reporting session has its due date changed', () => {
    const result = shouldGenerateNoticeOfChangeTrialStartDate(
      {
        ...MOCK_TRIAL_INPERSON,
        isCalendared: true,
        proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.reporting,
        startDate: '2026-04-06T05:00:00.000Z',
      },
      {
        ...MOCK_TRIAL_INPERSON,
        isCalendared: true,
        proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.reporting,
        startDate: '2026-04-13T05:00:00.000Z',
      },
    );

    expect(result).toEqual(false);
  });

  it.each([
    [
      TRIAL_SESSION_PROCEEDING_TYPES.reporting,
      TRIAL_SESSION_PROCEEDING_TYPES.inPerson,
    ],
    [
      TRIAL_SESSION_PROCEEDING_TYPES.inPerson,
      TRIAL_SESSION_PROCEEDING_TYPES.reporting,
    ],
  ])(
    'should return false if the start date changed and the proceeding type went from %s to %s',
    (currentProceedingType, updatedProceedingType) => {
      const result = shouldGenerateNoticeOfChangeTrialStartDate(
        {
          ...MOCK_TRIAL_INPERSON,
          isCalendared: true,
          proceedingType: currentProceedingType,
          startDate: '2026-04-06T05:00:00.000Z',
        },
        {
          ...MOCK_TRIAL_INPERSON,
          isCalendared: true,
          proceedingType: updatedProceedingType,
          startDate: '2026-04-13T05:00:00.000Z',
        },
      );

      expect(result).toEqual(false);
    },
  );
});
