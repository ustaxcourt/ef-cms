import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { getFeatureFlagValueFactoryAction } from './getFeatureFlagValueFactoryAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

describe('getFeatureFlagValueFactoryAction', () => {
  let pathYesStub;
  let pathNoStub;

  const { ALLOWLIST_FEATURE_FLAGS } = applicationContext.getConstants();
  const mockFeatureFlagObject = ALLOWLIST_FEATURE_FLAGS.INTERNAL_ORDER_SEARCH;

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
    for (const feature of Object.values(ALLOWLIST_FEATURE_FLAGS)) {
      applicationContext
        .getUseCases()
        .getFeatureFlagValueInteractor.mockResolvedValue(true);

      const result = await runAction(
        getFeatureFlagValueFactoryAction(feature),
        {
          modules: {
            presenter,
          },
        },
      );

      expect(result.state.featureFlags[feature.key]).toEqual(true);
    }
  });

  it('should return path.yes() if the interactor returns true', async () => {
    applicationContext
      .getUseCases()
      .getFeatureFlagValueInteractor.mockResolvedValue(true);

    await runAction(getFeatureFlagValueFactoryAction(mockFeatureFlagObject), {
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

    await runAction(getFeatureFlagValueFactoryAction(mockFeatureFlagObject), {
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

    await runAction(getFeatureFlagValueFactoryAction(mockFeatureFlagObject), {
      modules: {
        presenter,
      },
    });

    expect(pathNoStub.mock.calls[0][0].alertWarning.message).toEqual(
      mockFeatureFlagObject.disabledMessage,
    );
  });
});
