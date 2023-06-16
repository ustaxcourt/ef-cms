import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
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
    expect(result.state.navigation.caseDetailMenu).toBeUndefined();
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
    expect(result.state.navigation.caseDetailMenu).toBeUndefined();
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
    expect(result.state.navigation.caseDetailMenu).toBeUndefined();
  });

  it('sets the case detail menu with the value provided if same menu is not already open', async () => {
    const result = await runAction(toggleMenuAction, {
      modules: {
        presenter,
      },
      props: {
        caseDetailMenu: 'Something',
      },
      state: {
        navigation: {
          caseDetailMenu: 'SomethingElse',
        },
      },
    });
    expect(result.state.navigation.caseDetailMenu).toEqual('Something');
    expect(result.state.navigation.openMenu).toBeUndefined();
  });

  it('Unsets the case detail menu if menu string provided matches', async () => {
    const result = await runAction(toggleMenuAction, {
      modules: {
        presenter,
      },
      props: {
        caseDetailMenu: 'Something',
      },
      state: {
        navigation: {
          caseDetailMenu: 'Something',
        },
      },
    });
    expect(result.state.navigation.caseDetailMenu).not.toBeDefined();
    expect(result.state.navigation.openMenu).toBeUndefined();
  });

  it('Sets the case detail menu if there is no case detail menu', async () => {
    const result = await runAction(toggleMenuAction, {
      modules: {
        presenter,
      },
      props: {
        caseDetailMenu: 'Something',
      },
      state: {
        navigation: {},
      },
    });
    expect(result.state.navigation.caseDetailMenu).toEqual('Something');
    expect(result.state.navigation.openMenu).toBeUndefined();
  });
});
