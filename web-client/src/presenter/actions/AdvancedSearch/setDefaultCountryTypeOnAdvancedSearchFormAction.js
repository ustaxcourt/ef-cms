import { state } from 'cerebral';

/**
 * Clears any and all alerts that might be enabled.
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get function to retrieve state values
 * @param {object} providers.store the cerebral store object used for clearing alertError, alertSuccess, caseDetailErrors
 */
export const setDefaultCountryTypeOnAdvancedSearchFormAction = ({
  get,
  store,
}) => {
  const { COUNTRY_TYPES } = get(state.constants);
  store.set(state.form.countryType, COUNTRY_TYPES.DOMESTIC);
};
