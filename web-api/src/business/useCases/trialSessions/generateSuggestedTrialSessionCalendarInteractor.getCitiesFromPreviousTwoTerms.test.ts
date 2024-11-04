import { MOCK_TRIAL_REGULAR } from '@shared/test/mockTrial';
import { TRIAL_CITY_STRINGS } from '@shared/business/entities/EntityConstants';
import { getCitiesFromLastTwoTerms } from '@web-api/business/useCases/trialSessions/generateSuggestedTrialSessionCalendarInteractor';

describe('generateSuggestedTrialSessionCalendar', () => {
  it('should 0th and 1st trial city when they had a session in fall and spring 2024, respectively, and term start date is winter 2025', () => {
    const mockStartDate = '2025-01-12T04:00:00.000Z';
    const mockSessions = [
      {
        ...MOCK_TRIAL_REGULAR,
        startDate: '2024-11-22T04:00:00.000Z',
        term: 'Fall',
        termYear: '2024',
        trialLocation: TRIAL_CITY_STRINGS[0],
      },
      {
        ...MOCK_TRIAL_REGULAR,
        startDate: '2024-04-22T04:00:00.000Z',
        term: 'Spring',
        termYear: '2024',
        trialLocation: TRIAL_CITY_STRINGS[1],
      },
    ];

    const expectedResult = [TRIAL_CITY_STRINGS[0], TRIAL_CITY_STRINGS[1]];

    const citiesFromPreviousTwoTerms = getCitiesFromLastTwoTerms({
      sessions: mockSessions,
      termStartDate: mockStartDate,
    });

    expect(citiesFromPreviousTwoTerms).toEqual(expectedResult);
  });
});
