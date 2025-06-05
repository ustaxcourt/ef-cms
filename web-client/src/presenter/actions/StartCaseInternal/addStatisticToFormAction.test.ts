import { addStatisticToFormAction } from './addStatisticToFormAction';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { MAX_NUMBER_DEFICIENCY_STATISTICS } from '@shared/business/entities/EntityConstants';

describe('addStatisticToFormAction', () => {
  const statisticId = '8c35ffbb-773a-4a29-9868-329ffae4e065';

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  beforeEach(() => {
    presenter.providers.applicationContext.getUniqueId.mockReturnValue(
      statisticId,
    );
  });

  it('should add a statistic to the form.statistics array', async () => {
    const result = await runAction(addStatisticToFormAction, {
      modules: { presenter },
      state: {
        form: { statistics: [{ yearOrPeriod: 'Period' }] },
      },
    });

    expect(result.state.form.statistics.length).toEqual(2);
    expect(result.state.form.statistics[1]).toEqual({
      statisticId,
      yearOrPeriod: 'Year',
    });
  });

  it('should not add a statistic to the form.statistics array if its length is greater than the maximum', async () => {
    const manyStatistics: { yearOrPeriod: string }[] = [];
    for (let i = 0; i < MAX_NUMBER_DEFICIENCY_STATISTICS; i++) {
      manyStatistics.push({ yearOrPeriod: 'Period' });
    }
    const result = await runAction(addStatisticToFormAction, {
      modules: { presenter },
      state: {
        form: { statistics: manyStatistics },
      },
    });

    expect(result.state.form.statistics.length).toEqual(
      MAX_NUMBER_DEFICIENCY_STATISTICS,
    );
  });

  it('should default form.statistics to an array if it is not present on the form', async () => {
    const result = await runAction(addStatisticToFormAction, {
      modules: { presenter },
      state: {
        form: {},
      },
    });

    expect(result.state.form.statistics.length).toEqual(1);
  });
});
