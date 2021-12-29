import { state } from 'cerebral';

/**
 * Stores the advancedSearchTab and advancedSearchForm in local storage
 *
 * @param {object} applicationContext the application context
 * @param {object} get the cerebral get object
 * @returns {Promise<void>} returns promises of storing items in local storage
 */
export const persistPublicAppStateAction = async ({
  applicationContext,
  get,
}) => {
  await applicationContext.getUseCases().setItemInteractor(applicationContext, {
    key: 'advancedSearchTab',
    value: get(state.advancedSearchTab) || 'case',
  });
  await applicationContext.getUseCases().setItemInteractor(applicationContext, {
    key: 'advancedSearchForm',
    value: get(state.advancedSearchForm),
  });
};
