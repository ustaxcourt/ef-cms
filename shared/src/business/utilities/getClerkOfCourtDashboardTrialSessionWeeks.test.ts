import * as DateHandler from '@shared/business/utilities/DateHandler';
import { DateTime } from 'luxon';
import { getClerkOfCourtDashboardTrialSessionWeeks } from './getClerkOfCourtDashboardTrialSessionWeeks';

describe('getClerkOfCourtDashboardTrialSessionWeeks', () => {
  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  // weeks start on Monday and end on Sunday, in Eastern time
  it.each([
    {
      description: 'in the middle of the week',
      expected: {
        currentWeekEnd: '2026-11-16T04:59:59.999Z',
        currentWeekStart: '2026-11-09T05:00:00.000Z',
        nextWeekEnd: '2026-11-23T04:59:59.999Z',
        nextWeekStart: '2026-11-16T05:00:00.000Z',
      },
      now: '2026-11-11T15:00:00.000Z', // Wednesday 10:00 EST
    },
    {
      description:
        'late on Sunday in Eastern time, when it is already Monday in UTC',
      expected: {
        currentWeekEnd: '2026-11-16T04:59:59.999Z',
        currentWeekStart: '2026-11-09T05:00:00.000Z',
        nextWeekEnd: '2026-11-23T04:59:59.999Z',
        nextWeekStart: '2026-11-16T05:00:00.000Z',
      },
      now: '2026-11-16T04:30:00.000Z', // Sunday 23:30 EST
    },
    {
      description: 'early on Monday in Eastern time',
      expected: {
        currentWeekEnd: '2026-11-23T04:59:59.999Z',
        currentWeekStart: '2026-11-16T05:00:00.000Z',
        nextWeekEnd: '2026-11-30T04:59:59.999Z',
        nextWeekStart: '2026-11-23T05:00:00.000Z',
      },
      now: '2026-11-16T05:30:00.000Z', // Monday 00:30 EST
    },
    {
      description: 'in a week where daylight saving time ends',
      expected: {
        currentWeekEnd: '2026-11-02T04:59:59.999Z',
        currentWeekStart: '2026-10-26T04:00:00.000Z',
        nextWeekEnd: '2026-11-09T04:59:59.999Z',
        nextWeekStart: '2026-11-02T05:00:00.000Z',
      },
      now: '2026-10-30T16:00:00.000Z', // Friday 12:00 EDT
    },
    {
      description: 'in a week where daylight saving time starts',
      expected: {
        currentWeekEnd: '2026-03-09T03:59:59.999Z',
        currentWeekStart: '2026-03-02T05:00:00.000Z',
        nextWeekEnd: '2026-03-16T03:59:59.999Z',
        nextWeekStart: '2026-03-09T04:00:00.000Z',
      },
      now: '2026-03-05T17:00:00.000Z', // Thursday 12:00 EST
    },
    {
      description: 'in a week that crosses into a new year',
      expected: {
        currentWeekEnd: '2027-01-04T04:59:59.999Z',
        currentWeekStart: '2026-12-28T05:00:00.000Z',
        nextWeekEnd: '2027-01-11T04:59:59.999Z',
        nextWeekStart: '2027-01-04T05:00:00.000Z',
      },
      now: '2026-12-29T17:00:00.000Z', // Tuesday 12:00 EST
    },
  ])(
    'should return the current and next week $description',
    ({ expected, now }) => {
      jest.useFakeTimers({ now: DateTime.fromISO(now).toMillis() });

      expect(getClerkOfCourtDashboardTrialSessionWeeks()).toEqual(expected);
    },
  );

  it('should return undefined when the end of the current week cannot be calculated', () => {
    jest.spyOn(DateHandler, 'createEndOfDayISO').mockReturnValueOnce('');

    expect(getClerkOfCourtDashboardTrialSessionWeeks()).toBeUndefined();
  });

  it('should return undefined when the end of the next week cannot be calculated', () => {
    jest
      .spyOn(DateHandler, 'createEndOfDayISO')
      .mockReturnValueOnce('2026-11-16T04:59:59.999Z')
      .mockReturnValueOnce('');

    expect(getClerkOfCourtDashboardTrialSessionWeeks()).toBeUndefined();
  });
});
