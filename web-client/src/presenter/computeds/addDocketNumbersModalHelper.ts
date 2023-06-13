import { state } from '@web-client/presenter/app.cerebral';

export const addDocketNumbersModalHelper = get => {
  const addedDocketNumbers = get(state.addedDocketNumbers);

  return {
    confirmLabelTitle: addedDocketNumbers ? 'Save' : 'Add Docket Numbers',
    modalTitle: addedDocketNumbers
      ? 'Edit Docket Numbers'
      : 'Add Docket Numbers',
  };
};
