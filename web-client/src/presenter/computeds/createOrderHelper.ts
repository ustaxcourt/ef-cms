import { Get } from 'cerebral';
import { state } from '@web-client/presenter/app.cerebral';

export const createOrderHelper = (
  get: Get,
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
    showAddDocketNumbersButton: isLeadCase,
  };
};
