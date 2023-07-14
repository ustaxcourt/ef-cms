import { state } from '@web-client/presenter/app.cerebral';

export const setupCurrentPageAction =
  page =>
  async ({ applicationContext, get, store }: ActionProps) => {
    if (!get(state.featureFlags)) {
      const featureFlags = await applicationContext
        .getUseCases()
        .getAllFeatureFlagsInteractor(applicationContext);
      store.set(state.featureFlags, featureFlags);
    }

    store.set(state.currentPage, page);
    await new Promise(resolve => {
      setTimeout(resolve, 0);
    });
  };
