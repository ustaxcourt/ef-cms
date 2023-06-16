import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { isFeatureFlagEnabledFactoryAction } from './isFeatureFlagEnabledFactoryAction';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('isFeatureFlagEnabledFactoryAction', () => {
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

    applicationContext.getConstants.mockReturnValue({
      ALLOWLIST_FEATURE_FLAGS: {
        A_FEATURE: {
          disabledMessage: 'this is turned off :(',
          key: 'a-feature',
        },
      },
    });
  });

  it('should return path.yes() when the feature flag is turned on', async () => {
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
          goooDooBoo: true,
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
      },
    );

    expect(pathNoStub).toHaveBeenCalled();
    expect(pathNoStub.mock.calls[0][0].alertWarning.message).toEqual(
      'this is turned off :(',
    );
  });

  it('should return path.no() as a default when the provided feature flag is not found in props', async () => {
    await runAction(
      isFeatureFlagEnabledFactoryAction({
        disabledMessage: 'this is turned off :(',
        key: 'goooDooBoo',
      }),
      {
        modules: {
          presenter,
        },
        props: {},
      },
    );

    expect(pathNoStub).toHaveBeenCalled();
    expect(pathNoStub.mock.calls[0][0].alertWarning.message).toEqual(
      'this is turned off :(',
    );
  });

  it('should return path.no() as a default when no feature flag object is passed in', async () => {
    await runAction(isFeatureFlagEnabledFactoryAction({}), {
      modules: {
        presenter,
      },
      props: {
        goooDooBoo: true,
      },
    });

    expect(pathNoStub).toHaveBeenCalled();
  });
});
