import { state } from '@web-client/presenter/app.cerebral';

import { Get } from 'cerebral';
export const addDocketNumbersModalHelper = (get: Get): any => {
  const addedDocketNumbers = get(state.addedDocketNumbers);

  return {
    confirmLabelTitle: addedDocketNumbers ? 'Save' : 'Add Docket Numbers',
    modalTitle: addedDocketNumbers
      ? 'Edit Docket Numbers'
      : 'Add Docket Numbers',
  };
};
