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
      estimatedEndDate: 'Enter a valid estimated end date',
    });
  });
});
