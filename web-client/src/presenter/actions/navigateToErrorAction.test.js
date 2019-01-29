import { runAction } from 'cerebral/test';

import applicationContext from '../../applicationContext';
import presenter from '..';
import navigateToErrorAction from './navigateToErrorAction';

presenter.providers.applicationContext = applicationContext;
presenter.providers.router = {
  route: async url => {
    if (url === '/error}') {
      await test.runSequence('gotoErrorViewSequence', {});
    }
  },
};

describe('navigateToErrorAction', async () => {
  it('calls router.route to the error page', async () => {
    const result = await runAction(navigateToErrorAction, {
      state: {
        path: '123',
      },
      props: {},
    });
    expect(result.state.path).toEqual('123');
  });
});
