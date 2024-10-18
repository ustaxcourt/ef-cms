import { TrialSessionsPageValidation } from '@shared/business/entities/trialSessions/TrialSessionsPageValidation';

describe('TrialSessionsPageValidation entity', () => {
  it('should pass validation when dates are valid', () => {
    const trialSessionPage = new TrialSessionsPageValidation({
      endDate: '2024-09-04T04:00:00.000Z',
      startDate: '2024-09-01T04:00:00.000Z',
    });
    expect(trialSessionPage.getFormattedValidationErrors()).toBeNull();
  });
  it('should throw a validation error when dates are invalid', () => {
    const trialSessionPage = new TrialSessionsPageValidation({
      endDate: 'hello',
      startDate: 'goodbye',
    });
    expect(trialSessionPage.getFormattedValidationErrors()).toEqual({
      endDate: 'Enter date in format MM/DD/YYYY.',
      startDate: 'Enter date in format MM/DD/YYYY.',
    });
  });
  it('should throw a validation error when endDate comes before startDate', () => {
    const trialSessionPage = new TrialSessionsPageValidation({
      endDate: '2024-09-01T04:00:00.000Z',
      startDate: '2024-09-04T04:00:00.000Z',
    });
    expect(trialSessionPage.getFormattedValidationErrors()).toEqual({
      endDate: 'End date cannot be prior to start date.',
    });
  });
});
