import { Get } from 'cerebral';
import { state } from '@web-client/presenter/app.cerebral';

export const addDocketNumbersModalHelper = (
  get: Get,
): {
  confirmLabelTitle: string;
  modalTitle: string;
} => {
  const setSelectedConsolidatedCasesToMultiDocketOn = get(
    state.setSelectedConsolidatedCasesToMultiDocketOn,
  );

  return {
    confirmLabelTitle: setSelectedConsolidatedCasesToMultiDocketOn
      ? 'Save'
      : 'Add Docket Numbers',
    modalTitle: setSelectedConsolidatedCasesToMultiDocketOn
      ? 'Edit Docket Numbers'
      : 'Add Docket Numbers',
  };
};
