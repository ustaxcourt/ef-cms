import { getPreviousTwoTerms } from '@web-api/business/useCases/trialSessions/generateSuggestedTrialSessionCalendarInteractor';

describe('generateSuggestedTrialSessionCalendar', () => {
  it('should return spring and winter of 2019 when passed a date in fall of 2019', () => {
    const mockStartDate = '12/22/2019';

    const expectedResult = ['spring, 2019', 'winter, 2019'];

    const previousTwoTerms = getPreviousTwoTerms(mockStartDate);

    expect(previousTwoTerms).toEqual(expect.arrayContaining(expectedResult));
  });

  it('should return spring and fall of 2019 when passed a date in winter of 2020', () => {
    const mockStartDate = '01/22/2020';

    const expectedResult = ['spring, 2019', 'fall, 2019'];

    const previousTwoTerms = getPreviousTwoTerms(mockStartDate);

    expect(previousTwoTerms).toEqual(expect.arrayContaining(expectedResult));
  });
});
