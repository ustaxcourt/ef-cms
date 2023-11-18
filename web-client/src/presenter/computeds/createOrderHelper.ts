import { ClientApplicationContext } from '@web-client/applicationContext';
import { Get } from 'cerebral';
import { state } from '@web-client/presenter/app.cerebral';

// TODO: type return of helper
export const createOrderHelper = (
  get: Get,
  applicationContext: ClientApplicationContext,
): any => {
  const documentToEdit = get(state.documentToEdit);
  const caseDetail = get(state.caseDetail);
  const { documentTitle } = get(state.form);

  // we can potentially refactor out of using what consolidated cases 
  // to render UI info
  // const consolidatedCasesToMultiDocketOn = get(
  //   state.modal.form.consolidatedCasesToMultiDocketOn,
  // );
  const addConsolidatedCasesSeletected = get(
    state.processConsolidatedCasesSelection,
  );

  const { ALLOWLIST_FEATURE_FLAGS } = applicationContext.getConstants();
  const addDocketNumbersToOrderEnabled = get(
    state.featureFlags[
      ALLOWLIST_FEATURE_FLAGS.CONSOLIDATED_CASES_ADD_DOCKET_NUMBERS.key
    ],
  );
  const isEditing = !!documentToEdit;

  const pageTitle = isEditing
    ? `Edit ${documentTitle}`
    : `Create ${documentTitle}`;

  const isLeadCase = caseDetail.leadDocketNumber === caseDetail.docketNumber;

  return {
    addDocketNumbersButtonIcon: addConsolidatedCasesSeletected
      ? 'edit'
      : 'plus-circle',
    addDocketNumbersButtonText: addConsolidatedCasesSeletected
      ? 'Edit docket numbers in the caption'
      : 'Add docket numbers to the caption',
    documentToEdit,
    isEditing,
    pageTitle,
    showAddDocketNumbersButton: addDocketNumbersToOrderEnabled && isLeadCase,
  };
};
