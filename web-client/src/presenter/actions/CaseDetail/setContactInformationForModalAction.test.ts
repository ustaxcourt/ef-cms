import { runAction } from '@web-client/presenter/test.cerebral';
import { setContactInformationForModalAction } from './setContactInformationForModalAction';

describe('setContactInformationForModalAction', () => {
  let providers;
  beforeEach(() => {
    providers = {
      path: {
        seal: jest.fn(),
        unseal: jest.fn(),
      },
    };
  });

  it('should set the state.contactToSeal to the value of props.contactToSeal', async () => {
    const { state } = await runAction(setContactInformationForModalAction, {
      modules: {
        presenter: {
          providers,
        },
      },
      props: {
        contactToSeal: {
          contactId: '123',
          name: 'Spouse 1',
        },
      },
      state: {},
    });

    expect(state.contactToSeal).toEqual({
      contactId: '123',
      name: 'Spouse 1',
    });
  });

  it('should take the seal path when the contact address is not sealed', async () => {
    await runAction(setContactInformationForModalAction, {
      modules: {
        presenter: {
          providers,
        },
      },
      props: {
        contactToSeal: {
          contactId: '123',
          isAddressSealed: false,
          name: 'Spouse 1',
        },
      },
      state: {},
    });

    expect(providers.path.seal).toHaveBeenCalled();
    expect(providers.path.unseal).not.toHaveBeenCalled();
  });

  it('should take the unseal path when the contact address is sealed', async () => {
    await runAction(setContactInformationForModalAction, {
      modules: {
        presenter: {
          providers,
        },
      },
      props: {
        contactToSeal: {
          contactId: '123',
          isAddressSealed: true,
          name: 'Spouse 1',
        },
      },
      state: {},
    });

    expect(providers.path.unseal).toHaveBeenCalled();
  });
});
