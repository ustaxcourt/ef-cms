import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { parseDateToMonthDayYear } from './parseDateToMonthDayYear';
import moment from 'moment';

describe('parseDateToMonthDayYear', () => {
  const USTC_TZ = 'America/New_York';

  it('should return an empty object when the dateString can not be parsed', () => {
    applicationContext
      .getUtilities()
      .prepareDateFromString.mockReturnValue(undefined);

    const result = parseDateToMonthDayYear({
      applicationContext,
      dateString: 'adad;als',
    });

    expect(result).toEqual({});
  });

  it('should return an object that contains the day, month, and year as separate properties from the dateString provided', () => {
    applicationContext
      .getUtilities()
      .prepareDateFromString.mockReturnValue(
        moment.tz('2019-03-01T22:54:06.000Z', USTC_TZ),
      );

    const result = parseDateToMonthDayYear({
      applicationContext,
      dateString: '1/20/2021',
    });

    expect(result).toEqual({
      day: expect.anything(),
      month: expect.anything(),
      year: expect.anything(),
    });
  });
});
