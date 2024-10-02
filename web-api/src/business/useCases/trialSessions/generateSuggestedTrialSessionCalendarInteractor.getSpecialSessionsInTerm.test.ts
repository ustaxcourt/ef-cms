import { MOCK_TRIAL_REGULAR } from '@shared/test/mockTrial';
import {
  SESSION_TYPES,
  TRIAL_CITY_STRINGS,
} from '@shared/business/entities/EntityConstants';
import { getSpecialSessionsInTerm } from '@web-api/business/useCases/trialSessions/generateSuggestedTrialSessionCalendarInteractor';
import { getUniqueId } from '@shared/sharedAppContext';

// is special
// isCalendared
// not closed
// in term

const mockEligibleSpecialSessions = [
  {
    ...MOCK_TRIAL_REGULAR,
    isCalendared: true,
    sessionType: SESSION_TYPES.special,
    startDate: '2019-09-05T04:00:00.000Z',
    trialLocation: TRIAL_CITY_STRINGS[0],
    trialSessionId: getUniqueId(),
  },
  {
    ...MOCK_TRIAL_REGULAR,
    isCalendared: true,
    sessionType: SESSION_TYPES.special,
    startDate: '2019-09-12T04:00:00.000Z',
    trialLocation: TRIAL_CITY_STRINGS[0],
    trialSessionId: getUniqueId(),
  },
  {
    ...MOCK_TRIAL_REGULAR,
    isCalendared: true,
    sessionType: SESSION_TYPES.special,
    startDate: '2019-09-19T04:00:00.000Z',
    trialLocation: TRIAL_CITY_STRINGS[0],
    trialSessionId: getUniqueId(),
  },
];

describe('generateSuggestedTrialSessionCalendar.getSpecialSessionsInTerm', () => {
  it('should filter out special sessions outside the term date range', () => {
    const mockStartDate = '2019-09-01T04:00:00.000Z';
    const mockEndDate = '2019-09-30T04:00:00.000Z';
    const mockSessions = [
      ...mockEligibleSpecialSessions,
      {
        ...MOCK_TRIAL_REGULAR,
        isCalendared: true,
        sessionType: SESSION_TYPES.special,
        startDate: '2019-08-29T04:00:00.000Z',
        trialLocation: TRIAL_CITY_STRINGS[0],
        trialSessionId: getUniqueId(),
      },
    ];

    const actualSpecialSessions = getSpecialSessionsInTerm({
      sessions: mockSessions,
      termEndDate: mockEndDate,
      termStartDate: mockStartDate,
    });

    expect(actualSpecialSessions).toEqual(mockEligibleSpecialSessions);
  });
});
