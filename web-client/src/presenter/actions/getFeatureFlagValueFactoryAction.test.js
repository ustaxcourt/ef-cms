import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { getFeatureFlagValueFactoryAction } from './getFeatureFlagValueFactoryAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

describe('getFeatureFlagValueFactoryAction', () => {
  let pathYesStub;
  let pathNoStub;

  const mockFeatureFlagName = 'internalOrderSearch';
  const { ALLOWLIST_FEATURE_FLAGS, FEATURE_FLAG_DISABLED_MESSAGES } =
    applicationContext.getConstants();

  beforeAll(() => {
    pathYesStub = jest.fn();
    pathNoStub = jest.fn();

    presenter.providers.applicationContext = applicationContext;
    presenter.providers.path = {
      no: pathNoStub,
      yes: pathYesStub,
    };
  });

  it('should set the value of state.featureFlags.<feature_flag_name> to the value returned from the interactor', async () => {
    for (const featureFlag of Object.values(ALLOWLIST_FEATURE_FLAGS)) {
      applicationContext
        .getUseCases()
        .getFeatureFlagValueInteractor.mockResolvedValue(true);

      const result = await runAction(
        getFeatureFlagValueFactoryAction(featureFlag),
        {
          modules: {
            presenter,
          },
        },
      );

      expect(result.state.featureFlags[featureFlag]).toEqual(true);
    }
  });

  it('should return path.yes() if the interactor returns true', async () => {
    applicationContext
      .getUseCases()
      .getFeatureFlagValueInteractor.mockResolvedValue(true);

    await runAction(getFeatureFlagValueFactoryAction(mockFeatureFlagName), {
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

    await runAction(getFeatureFlagValueFactoryAction(mockFeatureFlagName), {
      modules: {
        presenter,
      },
    });

    expect(pathNoStub).toHaveBeenCalled();
    expect(pathNoStub.mock.calls[0][0].alertWarning).toBeDefined();
  });

  it('should return a feature flag specific message when the interactor returns false', async () => {
    applicationContext
      .getUseCases()
      .getFeatureFlagValueInteractor.mockResolvedValue(false);

    await runAction(getFeatureFlagValueFactoryAction(mockFeatureFlagName), {
      modules: {
        presenter,
      },
    });

    expect(pathNoStub.mock.calls[0][0].alertWarning.message).toEqual(
      FEATURE_FLAG_DISABLED_MESSAGES[mockFeatureFlagName],
    );
  });
});
