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
};
