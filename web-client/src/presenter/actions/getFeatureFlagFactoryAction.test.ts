import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { getFeatureFlagFactoryAction } from './getFeatureFlagFactoryAction';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('getFeatureFlagFactoryAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('should retrieve the value of a feature flag and return it on props', async () => {
    const mockFeatureFlagName = 'multi-docketable-paper-filings';

    applicationContext
      .getUseCases()
      .getFeatureFlagValueInteractor.mockResolvedValue(false);

    const result = await runAction(
      getFeatureFlagFactoryAction(mockFeatureFlagName),
      {
        modules: {
          presenter,
        },
      },
    );

    expect(result.output[mockFeatureFlagName]).toEqual(false);
  });
});
