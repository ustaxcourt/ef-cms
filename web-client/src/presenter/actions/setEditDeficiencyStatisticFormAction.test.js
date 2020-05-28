import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';
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
});
