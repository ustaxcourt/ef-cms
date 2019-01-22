import { runAction } from 'cerebral/test';

import applicationContext from '../applicationContext';
import presenter from '../presenter';

import setPathAction from '../presenter/actions/setPathAction';

presenter.providers.applicationContext = applicationContext;

describe('setPathAction', async () => {
  it('does not changes the existing path if props.path is not set', async () => {
    const result = await runAction(setPathAction, {
      state: {
        path: '123',
      },
      props: {},
    });
    expect(result.state.path).toEqual('123');
  });

  it('changes the existing path to match the props.path passed in', async () => {
    const result = await runAction(setPathAction, {
      state: {
        path: '123',
      },
      props: {
        path: 'gg',
      },
    });
    expect(result.state.path).toEqual('gg');
  });
});
