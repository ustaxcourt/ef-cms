import { ClientApplicationContext } from '@web-client/applicationContext';
import { Get } from 'cerebral';
import { state } from '@web-client/presenter/app.cerebral';

export const createOrderHelper = (
  get: Get,
  applicationContext: ClientApplicationContext,
): {
  addDocketNumbersButtonIcon: string;
  addDocketNumbersButtonText: string;
  documentToEdit: boolean;
  isEditing: boolean;
  pageTitle: string;
  showAddDocketNumbersButton: boolean;
} => {
  const documentToEdit = get(state.documentToEdit);
  const caseDetail = get(state.caseDetail);
  const { documentTitle } = get(state.form);

  const setSelectedConsolidatedCasesToMultiDocketOn = get(
    state.setSelectedConsolidatedCasesToMultiDocketOn,
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
    addDocketNumbersButtonIcon: setSelectedConsolidatedCasesToMultiDocketOn
      ? 'edit'
      : 'plus-circle',
    addDocketNumbersButtonText: setSelectedConsolidatedCasesToMultiDocketOn
      ? 'Edit docket numbers in the caption'
      : 'Add docket numbers to the caption',
    documentToEdit,
    isEditing,
    pageTitle,
    showAddDocketNumbersButton: addDocketNumbersToOrderEnabled && isLeadCase,
  };
};
