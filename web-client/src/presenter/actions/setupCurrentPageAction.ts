import { state } from '@web-client/presenter/app.cerebral';

/**
 * generates an action for setting the page
 * @param {string} page the name of the page to set
 * @returns {Promise} async action
 */
export const setupCurrentPageAction =
  page =>
  /**
   * sets the state.currentPage based on the scoped page
   * @param {object} providers the providers object
   * @param {object} providers.store the cerebral store used for setting the state.currentPage
   */
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
