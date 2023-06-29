import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { getAllFeatureFlagsAction } from './getAllFeatureFlagsAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

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
});
