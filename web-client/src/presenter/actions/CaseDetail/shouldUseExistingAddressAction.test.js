import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';
import { shouldUseExistingAddressAction } from './shouldUseExistingAddressAction';

describe('shouldUseExistingAddressAction', () => {
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

  it('should return the no path when state.form.useExistingAddress is false', async () => {
    await runAction(shouldUseExistingAddressAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          useExistingAddress: false,
        },
      },
    });

    expect(pathNoStub).toHaveBeenCalled();
  });

  it('should return the yes path when state.form.useExistingAddress is true', async () => {
    await runAction(shouldUseExistingAddressAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          useExistingAddress: true,
        },
      },
    });

    expect(pathYesStub).toHaveBeenCalled();
  });
});
