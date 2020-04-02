import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext.js';
import { getShouldCopyPrimaryToSecondaryAddressAction } from './getShouldCopyPrimaryToSecondaryAddressAction';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';

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
