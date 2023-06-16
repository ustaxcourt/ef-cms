import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setDefaultFormForAddDeficiencyStatisticsAction } from './setDefaultFormForAddDeficiencyStatisticsAction';

describe('setDefaultFormForAddDeficiencyStatisticsAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('sets state.form.yearOrPeriod to Year as the default value', async () => {
    const { state } = await runAction(
      setDefaultFormForAddDeficiencyStatisticsAction,
      {
        modules: { presenter },
        state: {},
      },
    );

    expect(state.form.yearOrPeriod).toBe('Year');
  });
});
