import { ADVANCED_SEARCH_TABS } from '../../../../shared/src/business/entities/EntityConstants';
import { applicationContext } from '../../applicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setDefaultAdvancedSearchTabAction } from './setDefaultAdvancedSearchTabAction';

describe('setDefaultAdvancedSearchTabAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('should set state.advancedSearchTab to ADVANCED_SEARCH_TABS.CASE', async () => {
    const { state } = await runAction(setDefaultAdvancedSearchTabAction, {
      modules: { presenter },
      state: { advancedSearchTab: 'something' },
    });

    expect(state.advancedSearchTab).toEqual(ADVANCED_SEARCH_TABS.CASE);
  });
});
