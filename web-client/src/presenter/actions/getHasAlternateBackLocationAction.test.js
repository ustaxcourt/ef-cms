import { getHasAlternateBackLocationAction } from './getHasAlternateBackLocationAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

describe('getHasAlternateBackLocationAction', () => {
  let trueStub;
  let falseStub;

  beforeAll(() => {
    trueStub = jest.fn();
    falseStub = jest.fn();

    presenter.providers.path = {
      false: falseStub,
      true: trueStub,
    };
  });

  it('should call the true path with path data if a backLocation is set on screenMetadata', async () => {
    await runAction(getHasAlternateBackLocationAction, {
      modules: {
        presenter,
      },
      state: {
        screenMetadata: {
          backLocation: '/back/location',
        },
      },
    });

    expect(trueStub).toHaveBeenLastCalledWith({ path: '/back/location' });
  });

  it('should NOT call the true path if a backLocation is NOT set on screenMetadata', async () => {
    await runAction(getHasAlternateBackLocationAction, {
      modules: {
        presenter,
      },
      state: {
        screenMetadata: {},
      },
    });

    expect(falseStub).toHaveBeenCalled();
  });
});
