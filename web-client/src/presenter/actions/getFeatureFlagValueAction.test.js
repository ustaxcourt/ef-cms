import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { getFeatureFlagValueAction } from './getFeatureFlagValueAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

describe('getFeatureFlagValueAction', () => {
  let pathYesStub;
  let pathNoStub;

  beforeAll(() => {
    pathYesStub = jest.fn();
    pathNoStub = jest.fn();

    presenter.providers.applicationContext = applicationContext;
    presenter.providers.path = {
      no: pathNoStub,
      yes: pathYesStub,
    };
  });

  it('should set state.isInternalOrderSearchEnabled to the value returned from the interactor', async () => {
    applicationContext
      .getUseCases()
      .getFeatureFlagValueInteractor.mockResolvedValue(true);

    const result = await runAction(getFeatureFlagValueAction, {
      modules: {
        presenter,
      },
    });

    expect(result.state.isInternalOrderSearchEnabled).toEqual(true);
  });

  it('should return path.yes() if the interactor returns true', async () => {
    applicationContext
      .getUseCases()
      .getFeatureFlagValueInteractor.mockResolvedValue(true);

    await runAction(getFeatureFlagValueAction, {
      modules: {
        presenter,
      },
    });

    expect(pathYesStub).toHaveBeenCalled();
  });

  it('should return path.no() with alert warning if the interactor returns false', async () => {
    applicationContext
      .getUseCases()
      .getFeatureFlagValueInteractor.mockResolvedValue(false);

    await runAction(getFeatureFlagValueAction, {
      modules: {
        presenter,
      },
    });

    expect(pathNoStub).toHaveBeenCalled();
    expect(pathNoStub.mock.calls[0][0].alertWarning).toBeDefined();
  });
});
