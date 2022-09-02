import { state } from 'cerebral';

export const addDocketNumbersModalHelper = get => {
  const consolidatedCases = get(state.addEditModel.consolidatedCases);

  return {
    confirmLabelTitle: consolidatedCases ? 'Save' : 'Add Docket Numbers',
    modelTitle: consolidatedCases
      ? 'Edit Docket Numbers'
      : 'Add Docket Numbers',
  };
};
