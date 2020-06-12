import { state } from 'cerebral';

/**
 * sets the default countryType on the advanced search form
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.store the cerebral store function
 */
export const defaultAdvancedSearchFormAction = ({
  applicationContext,
  get,
  store,
}) => {
  const { COUNTRY_TYPES } = applicationContext.getConstants();
  const advancedSearchForm = get(state.advancedSearchForm);
  // do not overwrite existing state so the form is still filled in when returning to the page
  if (!advancedSearchForm.caseSearchByDocketNumber) {
    store.set(state.advancedSearchForm.caseSearchByDocketNumber, {});
  }
  if (!advancedSearchForm.caseSearchByName) {
    store.set(state.advancedSearchForm.caseSearchByName, {
      countryType: COUNTRY_TYPES.DOMESTIC,
    });
  }
  if (!advancedSearchForm.practitionerSearchByBarNumber) {
    store.set(state.advancedSearchForm.practitionerSearchByBarNumber, {});
  }
  if (!advancedSearchForm.practitionerSearchByName) {
    store.set(state.advancedSearchForm.practitionerSearchByName, {});
  }
  if (!advancedSearchForm.searchMode) {
    store.set(state.advancedSearchForm.searchMode, 'byName');
  }
  if (!advancedSearchForm.orderSearch) {
    store.set(state.advancedSearchForm.orderSearch, {});
  }
  if (!advancedSearchForm.opinionSearch) {
    store.set(state.advancedSearchForm.opinionSearch, {});
    store.set(state.opinionDocumentTypes, []);
  }
};
