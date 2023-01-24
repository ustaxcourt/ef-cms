import {
  SESSION_TYPES,
  TRIAL_SESSION_PROCEEDING_TYPES,
} from '../../../../shared/src/business/entities/EntityConstants';
import { applicationContext } from '../../applicationContext';
import { formatSession } from './formattedTrialSessions';

describe('formattedTrialSessions formatSession', () => {
  const mockTrialSessions = [
    {
      caseOrder: [],
      judge: { name: '3', userId: '3' },
      noticeIssuedDate: '2019-07-25T15:00:00.000Z',
      proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.inPerson,
      sessionType: SESSION_TYPES.regular,
      startDate: '2019-11-27T15:00:00.000Z',
      swingSession: true,
      term: 'Winter',
      trialLocation: 'Jacksonville, FL',
    },
    {
      caseOrder: [],
      estimatedEndDate: '2045-02-17T15:00:00.000Z',
      judge: { name: '6', userId: '6' },
      proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.inPerson,
      sessionType: SESSION_TYPES.regular,
      startDate: '2044-02-17T15:00:00.000Z',
      swingSession: false,
      term: 'Spring',
      trialLocation: 'Jacksonville, FL',
    },
  ];

  it('formats trial sessions correctly selecting startOfWeek and formatting start date, startOfWeekSortable, and formattedNoticeIssued', () => {
    const result = formatSession(mockTrialSessions[0], applicationContext);
    expect(result).toMatchObject({
      formattedNoticeIssuedDate: '07/25/2019',
      formattedStartDate: '11/27/19',
      judge: { name: '3', userId: '3' },
      startDate: '2019-11-27T15:00:00.000Z',
      startOfWeek: 'November 25, 2019',
      startOfWeekSortable: '20191125',
    });
  });

  it('should format start date and estimated end date as "MM/DD/YYYY"', () => {
    const result = formatSession(mockTrialSessions[1], applicationContext);
    expect(result).toMatchObject({
      formattedEstimatedEndDate: '02/17/45',
      formattedStartDate: '02/17/44',
    });
  });
});
