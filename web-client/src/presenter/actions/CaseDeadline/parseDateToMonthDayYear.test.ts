import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { parseDateToMonthDayYear } from './parseDateToMonthDayYear';

describe('parseDateToMonthDayYear', () => {
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
      .deconstructDate.mockReturnValue({ day: '9', month: '11', year: '2009' });

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
