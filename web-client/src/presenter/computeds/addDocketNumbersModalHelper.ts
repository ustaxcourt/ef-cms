import { Get } from 'cerebral';
import { state } from '@web-client/presenter/app.cerebral';

export const addDocketNumbersModalHelper = (
  get: Get,
): {
  confirmLabelTitle: string;
  modalTitle: string;
} => {
  const saveSelectedDocketNumbers = get(state.saveSelectedDocketNumbers);

  return {
    confirmLabelTitle: saveSelectedDocketNumbers
      ? 'Save'
      : 'Add Docket Numbers',
    modalTitle: saveSelectedDocketNumbers
      ? 'Edit Docket Numbers'
      : 'Add Docket Numbers',
  };
};
