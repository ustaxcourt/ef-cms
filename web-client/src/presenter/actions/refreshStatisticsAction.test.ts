import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../presenter-mock';
import { refreshStatisticsAction } from './refreshStatisticsAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('refreshStatisticsAction', () => {
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

  it('should clear the statistics array if case type is not deficiency', async () => {
    const result = await runAction(refreshStatisticsAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          caseType: CASE_TYPES_MAP.other,
          hasVerifiedIrsNotice: true,
          statistics: [
            {
              yearOrPeriod: 'Year',
            },
          ],
        },
      },
    });

    expect(result.state.form.statistics.length).toEqual(0);
  });

  it('should append a new entry to the statistics array if case type is deficiency and hasVerifiedIrsNotice is true', async () => {
    const result = await runAction(refreshStatisticsAction, {
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
          ],
        },
      },
    });

    expect(result.state.form.statistics).toEqual([
      {
        yearOrPeriod: 'Year',
      },
      {
        statisticId,
        yearOrPeriod: 'Year',
      },
    ]);
  });

  it('should not append a new entry to the statistics array if it is >= 12 entries', async () => {
    const statistics = new Array(12).fill({
      yearOrPeriod: 'Year',
    });
    const result = await runAction(refreshStatisticsAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          caseType: CASE_TYPES_MAP.deficiency,
          hasVerifiedIrsNotice: true,
          statistics,
        },
      },
    });

    expect(result.state.form.statistics).toEqual(statistics);
  });

  it('should set a default statistics if statistics is null', async () => {
    const result = await runAction(refreshStatisticsAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          caseType: CASE_TYPES_MAP.deficiency,
          hasVerifiedIrsNotice: true,
          statistics: null,
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
