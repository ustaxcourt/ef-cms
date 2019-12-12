import { reduce } from 'lodash';
import { state } from 'cerebral';

/**
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get function
 * @param {object} providers.store the cerebral store
 */
export const setSelectedCasesForConsolidatedCaseDocumentSubmissionAction = ({
  get,
  store,
}) => {
  const casesToFileDocument = get(state.modal.casesToFileDocument);
  const selectedCases = reduce(
    casesToFileDocument,
    (accArray, checked, docketNumber) => {
      if (checked) {
        accArray.push(docketNumber);
      }
      return accArray;
    },
    [],
  );
  if (selectedCases.length > 1) {
    store.set(state.form.selectedCases, selectedCases);
  } else if (selectedCases.length === 1) {
    const currentCase = get(state.caseDetail.docketNumber);
    const selectedCase = selectedCases[0];

    if (currentCase != selectedCase) {
      // maybe should have validation or just route to that submission page
      store.set(state.form.selectedCases, selectedCases);
    }
  }
};
