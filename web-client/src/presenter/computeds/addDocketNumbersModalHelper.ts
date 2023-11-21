import { Get } from 'cerebral';
import { state } from '@web-client/presenter/app.cerebral';

export const addDocketNumbersModalHelper = (
  get: Get,
): {
  confirmLabelTitle: string;
  modalTitle: string;
} => {
  const addConsolidatedCasesSeletected = get(
    state.processConsolidatedCasesSelection,
  );

  return {
    confirmLabelTitle: addConsolidatedCasesSeletected
      ? 'Save'
      : 'Add Docket Numbers',
    modalTitle: addConsolidatedCasesSeletected
      ? 'Edit Docket Numbers'
      : 'Add Docket Numbers',
  };
};
