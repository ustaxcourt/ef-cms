import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { shouldUseContactPrimaryAddressAction } from './shouldUseContactPrimaryAddressAction';

describe('shouldUseContactPrimaryAddressAction', () => {
  let pathYesStub;
  let pathNoStub;

  beforeAll(() => {
    pathYesStub = jest.fn();
    pathNoStub = jest.fn();

    presenter.providers.path = {
      no: pathNoStub,
      yes: pathYesStub,
    };
  });

  it('should return the no path when state.form.useSameAsPrimary is false', async () => {
    await runAction(shouldUseContactPrimaryAddressAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          useSameAsPrimary: false,
        },
      },
    });

    expect(pathNoStub).toHaveBeenCalled();
  });

  it('should return the yes path when state.form.useSameAsPrimary is true', async () => {
    await runAction(shouldUseContactPrimaryAddressAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          useSameAsPrimary: true,
        },
      },
    });

    expect(pathYesStub).toHaveBeenCalled();
  });
});
