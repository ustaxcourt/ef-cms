import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { filterEmptyStatisticsAction } from './filterEmptyStatisticsAction';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';

describe('filterEmptyStatisticsAction', () => {
  const { CASE_TYPES_MAP } = applicationContext.getConstants();

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
          caseType: CASE_TYPES_MAP.deficiency,
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
