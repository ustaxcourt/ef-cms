import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { filterEmptyStatisticsAction } from './filterEmptyStatisticsAction';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('filterEmptyStatisticsAction', () => {
  const { CASE_TYPES_MAP } = applicationContext.getConstants();
  const statisticId = '8c35ffbb-773a-4a29-9868-329ffae4e065';

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  beforeEach(() => {
    presenter.providers.applicationContext.getUniqueId.mockReturnValue(
      statisticId,
    );
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
    presenter.providers.applicationContext.getUniqueId.mockReturnValue(
      statisticId,
    );

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
        statisticId,
        yearOrPeriod: 'Year',
      },
    ]);
  });

  it('appends default statistic as only statistic when the statistics array is undefined', async () => {
    const result = await runAction(filterEmptyStatisticsAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          caseType: CASE_TYPES_MAP.deficiency,
          hasVerifiedIrsNotice: true,
          statistics: undefined,
        },
      },
    });

    expect(result.state.form.statistics).toEqual([
      {
        statisticId,
        yearOrPeriod: 'Year',
      },
    ]);
  });
});
