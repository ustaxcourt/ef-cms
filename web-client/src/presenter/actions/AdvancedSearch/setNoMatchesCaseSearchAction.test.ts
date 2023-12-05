import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setNoMatchesCaseSearchAction } from './setNoMatchesCaseSearchAction';

describe('setNoMatchesCaseSearchAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('should set state.searchResults for case search to an empty array', async () => {
    const result = await runAction(setNoMatchesCaseSearchAction, {
      modules: { presenter },
      state: {
        searchResults: undefined,
      },
    });

    expect(
      result.state.searchResults[
        applicationContext.getConstants().ADVANCED_SEARCH_TABS.CASE
      ],
    ).toEqual([]);
  });
});
