import { state } from 'cerebral';

/**
 *
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get function
 * @returns {Function} returns a callback function that persists advancedSearchTab and advancedSearchForm to state
 */
export const persistPublicAppStateAction = async ({
  applicationContext,
  get,
}) => {
  await applicationContext.getUseCases().setItemInteractor(applicationContext, {
    key: 'advancedSearchTab',
    value: get(state.advancedSearchTab),
  });
  await applicationContext.getUseCases().setItemInteractor(applicationContext, {
    key: 'advancedSearchForm',
    value: get(state.advancedSearchForm),
  });
};
