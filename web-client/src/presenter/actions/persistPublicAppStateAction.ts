import { state } from '@web-client/presenter/app.cerebral';

/**
 * Stores the advancedSearchTab and advancedSearchForm in local storage
 * @param {object} applicationContext the application context
 * @param {object} get the cerebral get object
 */
export const persistPublicAppStateAction = ({
  applicationContext,
  get,
}: ActionProps) => {
  applicationContext.getUseCases().setItemInteractor(applicationContext, {
    key: 'advancedSearchTab',
    value: get(state.advancedSearchTab),
  });
  applicationContext.getUseCases().setItemInteractor(applicationContext, {
    key: 'advancedSearchForm',
    value: get(state.advancedSearchForm),
  });
};
