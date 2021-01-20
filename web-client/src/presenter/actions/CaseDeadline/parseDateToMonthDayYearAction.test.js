import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { parseDateToMonthDayYearAction } from './parseDateToMonthDayYearAction';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';

describe('parseDateToMonthDayYearAction', () => {
  presenter.providers.applicationContext = applicationContext;

  it('should return an empty object when the dateString can not be parsed', async () => {
    applicationContext
      .getUtilities()
      .prepareDateFromString.mockReturnValueOnce({
        toDate: () => {
          'alksjdf';
        },
      });

    const result = await runAction(parseDateToMonthDayYearAction, {
      dateString: 'adad;als01/20/2021',
      modules: {
        presenter,
      },
    });

    expect(result.output).toEqual({});
  });

  it('should return an object that contains the day, month, and year as separate properties from the dateString provided', async () => {
    const result = await runAction(parseDateToMonthDayYearAction, {
      dateString: '1/20/2021',
      modules: {
        presenter,
      },
    });

    expect(result.output).toEqual({
      day: expect.anything(),
      month: expect.anything(),
      year: expect.anything(),
    });
  });
});
