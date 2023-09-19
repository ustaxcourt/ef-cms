import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { getCaseDetailFormWithComputedDatesAction } from './getCaseDetailFormWithComputedDatesAction';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

const modules = { presenter };

describe('getCaseDetailFormWithComputedDatesAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });
  it('should return the expected combined caseDetail after run', async () => {
    const results = await runAction(getCaseDetailFormWithComputedDatesAction, {
      modules,
      state: {
        form: {
          irsNoticeDate: '01/01/2009',
          petitionPaymentDate: '01/01/2009',
          petitionPaymentDateWaived: '01/01/2009',
          receivedAt: '03/03/2009',
        },
      },
    });
    expect(results.output).toEqual({
      formWithComputedDates: {
        irsNoticeDate: '01/01/2009',
        petitionPaymentDate: '01/01/2009',
        petitionPaymentDateWaived: '01/01/2009',
        receivedAt: '03/03/2009',
      },
    });
  });
  it('calculates lastDateOfPeriod for each statistic or sets to undefined if lastDateOfPeriod values are not present', async () => {
    const results = await runAction(getCaseDetailFormWithComputedDatesAction, {
      modules,

      state: {
        form: {
          statistics: [
            {
              lastDateOfPeriodDay: '5',
              lastDateOfPeriodMonth: '8',
              lastDateOfPeriodYear: '2012',
            },
            {
              year: '2012',
            },
          ],
        },
      },
    });
    expect(
      results.output.formWithComputedDates.statistics[0].lastDateOfPeriod,
    ).toEqual('2012-08-05T04:00:00.000Z');
    expect(
      results.output.formWithComputedDates.statistics[1].lastDateOfPeriod,
    ).toEqual(null);
  });
});
