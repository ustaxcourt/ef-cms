import { state } from 'cerebral';

export const addDocketNumbersModalHelper = get => {
  const consolidatedCases = get(state.caseDetail.consolidatedCases);
  const addedDocketNumbers = get(state.addedDocketNumbers);

  const willAppendEtAl = consolidatedCases.some(
    theCase =>
      theCase.docketNumber !== theCase.leadDocketNumber && theCase.checked,
  );

  return {
    confirmLabelTitle: addedDocketNumbers ? 'Save' : 'Add Docket Numbers',
    modalText: willAppendEtAl
      ? 'Petitioner\'s name will be automatically appended with "ET AL.".'
      : '"ET AL." will not be appended to the caption.',
    modalTitle: addedDocketNumbers
      ? 'Edit Docket Numbers'
      : 'Add Docket Numbers',
  };
};
