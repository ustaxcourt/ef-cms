import { state } from '@web-client/presenter/app.cerebral';

import { ClientApplicationContext } from '@web-client/applicationContext';
import { Get } from 'cerebral';
export const createOrderHelper = (
  get: Get,
  applicationContext: ClientApplicationContext,
): any => {
  const documentToEdit = get(state.documentToEdit);
  const caseDetail = get(state.caseDetail);
  const { documentTitle } = get(state.form);
  const consolidatedCasesToMultiDocketOn = get(
    state.modal.form.consolidatedCasesToMultiDocketOn,
  );

  const addedDocketNumbers = applicationContext
    .getUtilities()
    .getSelectedConsolidatedCasesToMultiDocketOn(
      consolidatedCasesToMultiDocketOn,
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
    addDocketNumbersButtonIcon: addedDocketNumbers.length
      ? 'edit'
      : 'plus-circle',
    addDocketNumbersButtonText: addedDocketNumbers.length
      ? 'Edit docket numbers in the caption'
      : 'Add docket numbers to the caption',
    documentToEdit,
    isEditing,
    pageTitle,
    showAddDocketNumbersButton: addDocketNumbersToOrderEnabled && isLeadCase,
  };
};
