import { state } from '@web-client/presenter/app.cerebral';

/**
 * Clears the case info from modal state
 * Called when docket number changes or validation fails
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store
 */
export const clearNewMinuteSheetModalCaseInfoAction = ({
  store,
}: ActionProps) => {
  store.unset(state.modal.caseInfo);
  store.unset(state.modal.hasSearched);
  store.unset(state.modal.noResultsFound);
  store.unset(state.modal.isCaseAlreadyOnTrialSession);
  store.set(state.validationErrors, {});
};
