import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setCurrentPageAction } from './setCurrentPageAction';

describe('setCurrentPageAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('should set the current page', async () => {
    const result = await runAction(setCurrentPageAction('testPage'), {
      modules: {
        presenter,
      },
      props: {},
      state: {
        currentPage: '',
      },
    });

    expect(result.state.currentPage).toEqual('testPage');
  });
});
