import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { getShouldCopyPrimaryToSecondaryAddressAction } from './getShouldCopyPrimaryToSecondaryAddressAction';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('getShouldCopyPrimaryToSecondaryAddressAction', () => {
  let yesMock;
  let noMock;

  beforeAll(() => {
    yesMock = jest.fn();
    noMock = jest.fn();

    presenter.providers.path = {
      no: noMock,
      yes: yesMock,
    };

    presenter.providers.applicationContext = applicationContext;
  });

  it('should call the yes path when useSameAsPrimary is true', async () => {
    await runAction(getShouldCopyPrimaryToSecondaryAddressAction, {
      modules: {
        presenter,
      },

      state: {
        form: {
          useSameAsPrimary: true,
        },
      },
    });
    expect(yesMock).toHaveBeenCalled();
  });

  it('should call the no path when useSameAsPrimary is false', async () => {
    await runAction(getShouldCopyPrimaryToSecondaryAddressAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          useSameAsPrimary: false,
        },
      },
    });
    expect(noMock).toHaveBeenCalled();
  });
});
