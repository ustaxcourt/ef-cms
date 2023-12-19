import { ALL_COUNTRY_TYPE } from '@shared/business/entities/cases/CaseSearch';
import { state } from '@web-client/presenter/app.cerebral';

export const defaultAdvancedSearchFormAction = ({
  applicationContext,
  get,
  store,
}: ActionProps) => {
  const { ADVANCED_SEARCH_OPINION_TYPES } = applicationContext.getConstants();
  const advancedSearchForm = get(state.advancedSearchForm);
  // do not overwrite existing state so the form is still filled in when returning to the page
  if (!advancedSearchForm.caseSearchByDocketNumber) {
    store.set(state.advancedSearchForm.caseSearchByDocketNumber, {});
  }
  if (!advancedSearchForm.caseSearchByName) {
    store.set(state.advancedSearchForm.caseSearchByName, {
      countryType: ALL_COUNTRY_TYPE,
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
    store.set(state.advancedSearchForm.opinionSearch, {
      opinionTypes: {
        [ADVANCED_SEARCH_OPINION_TYPES.Memorandum]: true,
        [ADVANCED_SEARCH_OPINION_TYPES.Summary]: true,
        [ADVANCED_SEARCH_OPINION_TYPES.Bench]: true,
        [ADVANCED_SEARCH_OPINION_TYPES['T.C.']]: true,
      },
    });
    store.set(state.opinionDocumentTypes, []);
  }
  store.set(state.advancedSearchForm.currentPage, 1);
};
