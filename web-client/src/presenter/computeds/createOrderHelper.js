import { state } from 'cerebral';

export const createOrderHelper = (get, applicationContext) => {
  const documentToEdit = get(state.documentToEdit);
  const caseDetail = get(state.caseDetail);
  const addedDocketNumbers = get(state.addedDocketNumbers);
  const isEditing = !!documentToEdit;
  const { documentTitle } = get(state.form);

  const pageTitle = isEditing
    ? `Edit ${documentTitle}`
    : `Create ${documentTitle}`;

  const { ALLOWLIST_FEATURE_FLAGS } = applicationContext.getConstants();

  const addDocketNumbersToOrderEnabled = get(
    state.featureFlags[
      ALLOWLIST_FEATURE_FLAGS.CONSOLIDATED_CASES_ADD_DOCKET_NUMBERS.key
    ],
  );

  const isLeadCase = caseDetail.leadDocketNumber === caseDetail.docketNumber;

  return {
    addDocketNumbersButtonIcon: addedDocketNumbers ? 'edit' : 'plus-circle',
    addDocketNumbersButtonText: addedDocketNumbers
      ? 'Edit docket numbers in the cover sheet'
      : 'Add docket numbers to the cover sheet',
    documentToEdit,
    isEditing,
    pageTitle,
    showAddDocketNumbersButton: addDocketNumbersToOrderEnabled && isLeadCase,
  };
};
