import { TRIAL_SESSION_PROCEEDING_TYPES } from '../EntityConstants';
import { EditTrialSession } from '@shared/business/entities/trialSessions/EditTrialSession';
import {
  calculateISODate,
  createISODateString,
} from '@shared/business/utilities/DateHandler';
import { MOCK_TRIAL_REGULAR } from '@shared/test/mockTrial';

describe('EditTrialSession', () => {
  const yesterday = calculateISODate({
    dateString: createISODateString(),
    howMuch: -1,
    units: 'days',
  });
  const today = createISODateString();
  const tomorrow = calculateISODate({
    dateString: createISODateString(),
    howMuch: 1,
    units: 'days',
  });

  it('should allow startDate to be in the past', () => {
    const trialSession = new EditTrialSession({
      ...MOCK_TRIAL_REGULAR,
      startDate: yesterday,
      estimatedEndDate: tomorrow,
    });
    expect(trialSession.isValid()).toEqual(true);
  });

  it('should allow startDate to be today', () => {
    const trialSession = new EditTrialSession({
      ...MOCK_TRIAL_REGULAR,
      startDate: today,
      estimatedEndDate: tomorrow,
    });

    expect(trialSession.isValid()).toEqual(true);
  });

  it('should allow startDate to be in the future', () => {
    const trialSession = new EditTrialSession({
      ...MOCK_TRIAL_REGULAR,
      startDate: calculateISODate({
        dateString: createISODateString(),
        howMuch: 1,
        units: 'days',
      }),
      estimatedEndDate: calculateISODate({
        dateString: createISODateString(),
        howMuch: 2,
        units: 'days',
      }),
    });

    expect(trialSession.isValid()).toEqual(true);
  });

  it('should require estimatedEndDate to be after startDate', () => {
    const trialSession = new EditTrialSession({
      ...MOCK_TRIAL_REGULAR,
      startDate: tomorrow,
      estimatedEndDate: today,
    });

    expect(trialSession.isValid()).toEqual(false);
    expect(trialSession.getFormattedValidationErrors()).toMatchObject({
      estimatedEndDate: 'Estimated end date must be after start date',
    });
  });
});

describe('Reporting validation', () => {
  const reportingSession = {
    ...MOCK_TRIAL_REGULAR,
    proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.reporting,
    startDate: '3000-12-01T00:00:00.000Z',
    estimatedEndDate: '3000-12-01T00:00:00.000Z',
    startTime: undefined,
  };

  it('should accept a Reporting session with matching dates and no time', () => {
    const entity = new EditTrialSession(reportingSession);
    expect(entity.getFormattedValidationErrors()).toBeNull();
    expect(entity.startTime).toBeUndefined();
  });

  it.each([
    [undefined, 'Enter a valid estimated end date'],
    ['3000-12-02T00:00:00.000Z', 'Reporting start and end date must match'],
    ['3000-11-30T00:00:00.000Z', 'Reporting start and end date must match'],
  ])('should reject end date %s', (estimatedEndDate, message) => {
    expect(
      new EditTrialSession({
        ...reportingSession,
        estimatedEndDate,
      }).getFormattedValidationErrors(),
    ).toHaveProperty('estimatedEndDate', message);
  });
});
