import { ClientApplicationContext } from '@web-client/applicationContext';
import { Get } from 'cerebral';
import { state } from '@web-client/presenter/app.cerebral';

export const addDocketNumbersModalHelper = (
  get: Get,
  applicationContext: ClientApplicationContext,
): {
  confirmLabelTitle: string;
  modalTitle: string;
} => {
  console.log(
    'get(state.modal.form.processConsolidatedCasesSelection)',
    get(state.processConsolidatedCasesSelection),
  );

  const addConsolidatedCasesSeletected = get(
    state.processConsolidatedCasesSelection,
  );
  // console.log('addConsolidatedCasesSeletected', addConsolidatedCasesSeletected);
  // const addedDocketNumbers = applicationContext
  //   .getUtilities()
  //   .getSelectedConsolidatedCasesToMultiDocketOn(
  //     consolidatedCasesToMultiDocketOn,
  //   );

  return {
    confirmLabelTitle: addConsolidatedCasesSeletected
      ? 'Save'
      : 'Add Docket Numbers',
    modalTitle: addConsolidatedCasesSeletected
      ? 'Edit Docket Numbers'
      : 'Add Docket Numbers',
  };
};
