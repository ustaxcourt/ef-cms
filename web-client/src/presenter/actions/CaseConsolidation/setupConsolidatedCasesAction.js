import { state } from 'cerebral';
//TODO: fix jsdocs
/**
 * call to consolidate cases
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.props the cerebral props object
 * @returns {Promise} async action
 */

export const setupConsolidatedCasesAction = ({ get, store }) => {
  let consolidatedCases = get(state.caseDetail.consolidatedCases);

  consolidatedCases = consolidatedCases.map(consolidatedCase => {
    return {
      ...consolidatedCase,
      checked: true,
      formattedPetitioners: consolidatedCase.petitioners
        .map(ptr => ptr.name)
        .join(' & '),
    };
  });

  store.set(state.consolidatedCaseAllCheckbox, true);
  store.set(state.initialEnabledCheckBoxValue, true);
  store.set(state.caseDetail.consolidatedCases, consolidatedCases);
};
