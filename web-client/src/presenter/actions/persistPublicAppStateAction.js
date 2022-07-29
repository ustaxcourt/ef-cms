import { state } from 'cerebral';

/**
 * Stores the advancedSearchTab and advancedSearchForm in local storage
 *
 * @param {object} applicationContext the application context
 * @param {object} get the cerebral get object
 */
export const persistPublicAppStateAction = ({ applicationContext, get }) => {
  console.log('we are here', get(state.advancedSearchTab));
  applicationContext.getUseCases().setItemInteractor(applicationContext, {
    key: 'advancedSearchTab',
    value: get(state.advancedSearchTab),
  });
  console.log('we are there');

  applicationContext.getUseCases().setItemInteractor(applicationContext, {
    key: 'advancedSearchForm',
    value: get(state.advancedSearchForm),
  });
};
