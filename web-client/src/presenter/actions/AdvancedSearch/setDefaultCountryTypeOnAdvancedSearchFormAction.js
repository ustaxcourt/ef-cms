import { state } from 'cerebral';

/**
 * sets the default countryType on the advanced search form
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.store the cerebral store function
 */
export const setDefaultCountryTypeOnAdvancedSearchFormAction = ({
  applicationContext,
  store,
}) => {
  const { COUNTRY_TYPES } = applicationContext.getConstants();
  store.set(state.advancedSearchForm.countryType, COUNTRY_TYPES.DOMESTIC);
};
