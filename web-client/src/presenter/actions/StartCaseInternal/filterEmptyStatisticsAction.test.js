import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { filterEmptyStatisticsAction } from './filterEmptyStatisticsAction';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';

describe('filterEmptyStatisticsAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('filters out empty statistics', async () => {
    const result = await runAction(filterEmptyStatisticsAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          statistics: [
            {
              yearOrPeriod: 'Year',
            },
            {
              yearOrPeriod: 'Year',
            },
          ],
        },
      },
    });

    expect(result.state.form.statistics).toEqual([]);
  });

  it('appends default statistic if deficiency and hasVerifiedIrsNotice', async () => {
    const result = await runAction(filterEmptyStatisticsAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          caseType: 'Deficiency',
          hasVerifiedIrsNotice: true,
          statistics: [
            {
              yearOrPeriod: 'Year',
            },
            {
              yearOrPeriod: 'Year',
            },
          ],
        },
      },
    });

    expect(result.state.form.statistics).toEqual([
      {
        yearOrPeriod: 'Year',
      },
    ]);
  });
});
