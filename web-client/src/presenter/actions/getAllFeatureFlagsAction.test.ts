import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { getAllFeatureFlagsAction } from './getAllFeatureFlagsAction';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('getAllFeatureFlagsAction', () => {
  const mockFeatureFlagsObject = {
    mockFlagKey: 'mockFlagValue',
  };

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;

    applicationContext
      .getUseCases()
      .getAllFeatureFlagsInteractor.mockResolvedValue(mockFeatureFlagsObject);
  });

  it('makes a call to retrieve all feature flags', async () => {
    await runAction(getAllFeatureFlagsAction, {
      modules: {
        presenter,
      },
      state: {},
    });
    expect(
      applicationContext.getUseCases().getAllFeatureFlagsInteractor,
    ).toHaveBeenCalled();
  });

  it('sets all feature flags on state', async () => {
    const result = await runAction(getAllFeatureFlagsAction, {
      modules: {
        presenter,
      },
      state: {},
    });

    expect(result.state.featureFlags).toEqual(mockFeatureFlagsObject);
  });

  it('should set features flags to an empty object on errors', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});

    applicationContext
      .getUseCases()
      .getAllFeatureFlagsInteractor.mockRejectedValue(new Error('gg'));

    const result = await runAction(getAllFeatureFlagsAction, {
      modules: {
        presenter,
      },
      state: {},
    });

    expect(result.state.featureFlags).toEqual({});
  });
});
