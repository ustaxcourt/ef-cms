import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setEditDeficiencyStatisticFormAction } from './setEditDeficiencyStatisticFormAction';

describe('setEditDeficiencyStatisticFormAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('sets the statistic with the given index onto the form from the state.caseDetail', async () => {
    const result = await runAction(setEditDeficiencyStatisticFormAction, {
      modules: { presenter },
      props: { statisticId: '771997ff-ff16-4de6-8143-2b10e6eafe98' },
      state: {
        caseDetail: {
          statistics: [
            {
              irsTotalPenalties: 1,
              statisticId: '771997ff-ff16-4de6-8143-2b10e6eafe98',
            },
          ],
        },
      },
    });
    expect(result.state.form).toEqual({
      irsTotalPenalties: 1,
      statisticId: '771997ff-ff16-4de6-8143-2b10e6eafe98',
    });
  });

  it('sets the statistic with the given index onto the form from the state.caseDetail with a deconstructed lastDateOfPeriod', async () => {
    const result = await runAction(setEditDeficiencyStatisticFormAction, {
      modules: { presenter },
      props: { statisticId: '771997ff-ff16-4de6-8143-2b10e6eafe98' },
      state: {
        caseDetail: {
          statistics: [
            {
              irsTotalPenalties: 1,
              lastDateOfPeriod: '2019-03-01T21:40:46.415Z',
              statisticId: '771997ff-ff16-4de6-8143-2b10e6eafe98',
            },
          ],
        },
      },
    });
    expect(result.state.form).toEqual({
      irsTotalPenalties: 1,
      lastDateOfPeriod: '2019-03-01T21:40:46.415Z',
      lastDateOfPeriodDay: '1',
      lastDateOfPeriodMonth: '3',
      lastDateOfPeriodYear: '2019',
      statisticId: '771997ff-ff16-4de6-8143-2b10e6eafe98',
    });
  });

  it('leaves the statistic unchanged if last date of period cannot be parsed as a date and is returned as undefined', async () => {
    applicationContext
      .getUtilities()
      .deconstructDate.mockReturnValueOnce(undefined);
    const result = await runAction(setEditDeficiencyStatisticFormAction, {
      modules: { presenter },
      props: { statisticId: '771997ff-ff16-4de6-8143-2b10e6eafe98' },
      state: {
        caseDetail: {
          statistics: [
            {
              irsTotalPenalties: 1,
              lastDateOfPeriod: 'definitely not a date',
              lastDateOfPeriodDay: '7',
              lastDateOfPeriodMonth: '7',
              lastDateOfPeriodYear: '2017',
              statisticId: '771997ff-ff16-4de6-8143-2b10e6eafe98',
            },
          ],
        },
      },
    });

    expect(result.state.form).toEqual({
      irsTotalPenalties: 1,
      lastDateOfPeriod: 'definitely not a date',
      lastDateOfPeriodDay: '7',
      lastDateOfPeriodMonth: '7',
      lastDateOfPeriodYear: '2017',
      statisticId: '771997ff-ff16-4de6-8143-2b10e6eafe98',
    });
  });
});
