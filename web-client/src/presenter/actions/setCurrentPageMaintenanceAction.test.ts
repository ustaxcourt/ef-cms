import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setCurrentPageMaintenanceAction } from './setCurrentPageMaintenanceAction';

describe('setCurrentPageMaintenanceAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('should set the current page to AppMaintenance', async () => {
    const result = await runAction(setCurrentPageMaintenanceAction, {
      modules: {
        presenter,
      },
      props: {},
      state: {
        currentPage: '',
      },
    });

    expect(result.state.currentPage).toEqual('AppMaintenance');
  });
});
