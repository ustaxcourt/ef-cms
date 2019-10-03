import { state } from 'cerebral';

/**
 * sets the default countryType on the advanced search form
 *
 * @param {object} providers the providers object
 * @param {Function} providers.get the cerebral get function
 * @param {Function} providers.store the cerebral store function
 */
export const setDefaultCountryTypeOnAdvancedSearchFormAction = ({
  get,
  store,
}) => {
  const { COUNTRY_TYPES } = get(state.constants);
  store.set(state.advancedSearchForm.countryType, COUNTRY_TYPES.DOMESTIC);
};
