import { state } from 'cerebral';

/**
 * initialize consolidated case state values for ConfirmInitiateServiceModal
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get object
 * @param {object} providers.store the cerebral store object
 */
export const setupConsolidatedCasesAction = ({ get, store }) => {
  let consolidatedCases = get(state.caseDetail.consolidatedCases);

  if (consolidatedCases) {
    consolidatedCases = consolidatedCases.map(consolidatedCase => {
      return {
        ...consolidatedCase,
        checkboxDisabled: true,
        checked: true,
        formattedPetitioners: consolidatedCase.petitioners
          .map(ptr => ptr.name)
          .join(' & '),
        tooltip: '',
      };
    });

    store.set(state.consolidatedCaseAllCheckbox, true);
    store.set(state.caseDetail.consolidatedCases, consolidatedCases);
  }
};
