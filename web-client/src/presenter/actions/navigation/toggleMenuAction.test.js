import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { toggleMenuAction } from './toggleMenuAction';

describe('toggleMenuAction', () => {
  it('sets the open menu with the value provided if same menu is not already open', async () => {
    const result = await runAction(toggleMenuAction, {
      modules: {
        presenter,
      },
      props: {
        openMenu: 'Something',
      },
      state: {
        navigation: {
          openMenu: 'SomethingElse',
        },
      },
    });
    expect(result.state.navigation.openMenu).toEqual('Something');
  });

  it('Unsets the open menu if menu string provided matches', async () => {
    const result = await runAction(toggleMenuAction, {
      modules: {
        presenter,
      },
      props: {
        openMenu: 'Something',
      },
      state: {
        navigation: {
          openMenu: 'Something',
        },
      },
    });
    expect(result.state.navigation.openMenu).not.toBeDefined();
  });

  it('Sets the open menu if there is no open menu', async () => {
    const result = await runAction(toggleMenuAction, {
      modules: {
        presenter,
      },
      props: {
        openMenu: 'Something',
      },
      state: {
        navigation: {},
      },
    });
    expect(result.state.navigation.openMenu).toEqual('Something');
  });
});
