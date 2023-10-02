import { DESCENDING } from '@shared/business/entities/EntityConstants';
import { applicationContextForClient } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '@web-client/presenter/presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setDefaultSubmittedAndCavSortOrderAction } from '@web-client/presenter/actions/JudgeActivityReport/setDefaultSubmittedAndCavSortOrderAction';

describe('setDefaultSubmittedAndCavSortOrderAction', () => {
  presenter.providers.applicationContext = applicationContextForClient;

  it('should set default submitted/CAV sort order to descending', async () => {
    const result = await runAction(setDefaultSubmittedAndCavSortOrderAction, {
      modules: { presenter },
      state: {},
    });

    expect(result.state.tableSort).toEqual({
      sortField: 'daysElapsedSinceLastStatusChange',
      sortOrder: DESCENDING,
    });
  });
});
