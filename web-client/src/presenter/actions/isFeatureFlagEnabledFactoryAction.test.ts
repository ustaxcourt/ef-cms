import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { isFeatureFlagEnabledFactoryAction } from './isFeatureFlagEnabledFactoryAction';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('isFeatureFlagEnabledFactoryAction', () => {
  const mockFeatureFlagsObject = {
    MOCK_FEATURE_FLAG_NAME: {
      disabledMessage: 'The ability to perform this feature has been disabled.',
      key: 'mock-key',
    },
  };
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

    applicationContext
      .getUseCases()
      .getAllFeatureFlagsInteractor.mockResolvedValue(mockFeatureFlagsObject);
  });

  it('should return path.yes() when the feature flag is turned on', async () => {
    await runAction(
      isFeatureFlagEnabledFactoryAction(
        mockFeatureFlagsObject.MOCK_FEATURE_FLAG_NAME,
      ),
      {
        modules: {
          presenter,
        },
        props: {
          goooDooBoo: true,
        },
        state: {
          featureFlags: {
            mockFeatureFlagsObject,
          },
        },
      },
    );

    expect(pathYesStub).toHaveBeenCalled();
  });

  it('should return path.no() with alert warning when the feature flag is turned off', async () => {
    await runAction(
      isFeatureFlagEnabledFactoryAction({
        disabledMessage: 'this is turned off :(',
        key: 'goooDooBoo',
      }),
      {
        modules: {
          presenter,
        },
        props: {
          goooDooBoo: false,
        },
        state: {
          featureFlags: {},
        },
      },
    );

    expect(pathNoStub).toHaveBeenCalled();
    expect(pathNoStub.mock.calls[0][0].alertWarning.message).toEqual(
      'this is turned off :(',
    );
  });

  it('should retrieve and set all feature flags from eprsistence when state.featureFlags is empty', async () => {
    const result = await runAction(
      isFeatureFlagEnabledFactoryAction(
        mockFeatureFlagsObject.MOCK_FEATURE_FLAG_NAME,
      ),
      {
        modules: {
          presenter,
        },
        props: {
          goooDooBoo: true,
        },
        state: {
          featureFlags: {},
        },
      },
    );

    expect(
      applicationContext.getUseCases().getAllFeatureFlagsInteractor,
    ).toHaveBeenCalled();
    expect(result.state.featureFlags).toEqual(mockFeatureFlagsObject);
  });
});
