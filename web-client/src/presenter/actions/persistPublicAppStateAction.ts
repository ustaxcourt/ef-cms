import { state } from '@web-client/presenter/app.cerebral';

/**
 * Stores the advancedSearchTab and advancedSearchForm in local storage
 * @param {object} applicationContext the application context
 * @param {object} get the cerebral get object
 */
export const persistPublicAppStateAction = async ({
  applicationContext,
  get,
}: ActionProps) => {
  await applicationContext.getUseCases().setItemInteractor(applicationContext, {
    key: 'advancedSearchTab',
    value: get(state.advancedSearchTab),
  });
  await applicationContext.getUseCases().setItemInteractor(applicationContext, {
    key: 'advancedSearchForm',
    value: get(state.advancedSearchForm),
  });
};
