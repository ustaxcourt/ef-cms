import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setupCurrentPageAction } from './setupCurrentPageAction';

describe('setupCurrentPageAction', () => {
  const featureFlagObject = {
    'consolidated-cases-add-docket-numbers': true,
    'consolidated-cases-group-access-petitioner': true,
    'document-visibility-policy-change-date': '2023-05-01',
    'e-consent-fields-enabled-feature-flag': true,
  };

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;

    applicationContext
      .getUseCases()
      .getAllFeatureFlagsInteractor.mockResolvedValue(featureFlagObject);
  });

  it('should set the current page', async () => {
    const result = await runAction(setupCurrentPageAction('testPage'), {
      modules: {
        presenter,
      },
      props: {},
      state: {
        currentPage: '',
      },
    });

    expect(result.state.currentPage).toEqual('testPage');
  });

  it('should fetch and set feature flags in state when they do not yet exist', async () => {
    const result = await runAction(setupCurrentPageAction('testPage'), {
      modules: {
        presenter,
      },
      props: {},
      state: {
        currentPage: '',
        featureFlags: undefined,
      },
    });

    expect(
      applicationContext.getUseCases().getAllFeatureFlagsInteractor,
    ).toHaveBeenCalled();
    expect(result.state.featureFlags).toEqual(featureFlagObject);
  });

  it('should NOT fetch and set feature flags in state when they already exist in state', async () => {
    const result = await runAction(setupCurrentPageAction('testPage'), {
      modules: {
        presenter,
      },
      props: {},
      state: {
        currentPage: '',
        featureFlags: { ...featureFlagObject, bonusFlag: true },
      },
    });

    expect(
      applicationContext.getUseCases().getAllFeatureFlagsInteractor,
    ).not.toHaveBeenCalled();
    expect(result.state.featureFlags).toEqual({
      ...featureFlagObject,
      bonusFlag: true,
    });
  });
});
