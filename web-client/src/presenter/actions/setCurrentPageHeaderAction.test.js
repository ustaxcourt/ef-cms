import { applicationContext } from '../../applicationContext';
import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';
import { setCurrentPageHeaderAction } from './setCurrentPageHeaderAction';

presenter.providers.applicationContext = applicationContext;

describe('setCurrentPageHeaderAction', () => {
  it('sets the current page header', async () => {
    const result = await runAction(setCurrentPageHeaderAction('testHeader'), {
      props: {},
      state: {
        currentPageHeader: '',
      },
    });

    expect(result.state.currentPageHeader).toEqual('testHeader');
  });
});
