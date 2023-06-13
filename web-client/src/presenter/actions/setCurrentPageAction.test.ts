import { applicationContext } from '../../applicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setCurrentPageAction } from './setCurrentPageAction';

presenter.providers.applicationContext = applicationContext;

describe('setCurrentPageAction', () => {
  it('sets the current page', async () => {
    const result = await runAction(setCurrentPageAction('testPage'), {
      props: {},
      state: {
        currentPage: '',
      },
    });

    expect(result.state.currentPage).toEqual('testPage');
  });
});
