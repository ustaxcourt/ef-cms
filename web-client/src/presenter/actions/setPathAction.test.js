import { applicationContext } from '../../applicationContext';
import presenter from '..';
import { runAction } from 'cerebral/test';
import { setPathAction } from './setPathAction';

presenter.providers.applicationContext = applicationContext;

describe('setPathAction', () => {
  it('does not changes the existing path if props.path is not set', async () => {
    const result = await runAction(setPathAction, {
      props: {},
      state: {
        path: '123',
      },
    });
    expect(result.state.path).toEqual('123');
  });

  it('changes the existing path to match the props.path passed in', async () => {
    const result = await runAction(setPathAction, {
      props: {
        path: 'gg',
      },
      state: {
        path: '123',
      },
    });
    expect(result.state.path).toEqual('gg');
  });
});
