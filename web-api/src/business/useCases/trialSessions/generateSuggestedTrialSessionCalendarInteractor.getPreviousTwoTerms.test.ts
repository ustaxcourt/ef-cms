import { getPreviousTwoTerms } from '@web-api/business/useCases/trialSessions/generateSuggestedTrialSessionCalendarInteractor';

describe('generateSuggestedTrialSessionCalendar', () => {
  it('should return spring and winter of 2019 when passed a date in fall of 2019', () => {
    const mockStartDate = '2019-12-12T04:00:00.000Z';

    const expectedResult = ['spring, 2019', 'winter, 2019'];

    const previousTwoTerms = getPreviousTwoTerms(mockStartDate);

    expect(previousTwoTerms).toEqual(expect.arrayContaining(expectedResult));
  });

  it('should return spring and fall of 2019 when passed a date in winter of 2020', () => {
    const mockStartDate = '2020-01-10T04:00:00.000Z';

    const expectedResult = ['spring, 2019', 'fall, 2019'];

    const previousTwoTerms = getPreviousTwoTerms(mockStartDate);

    expect(previousTwoTerms).toEqual(expect.arrayContaining(expectedResult));
  });
});
