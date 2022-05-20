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

export const initializeFormattedConsolidatedCasesCheckboxesAction = ({
  get,
  store,
}) => {
  let consolidatedCases = get(state.caseDetail.consolidatedCases);

  consolidatedCases = consolidatedCases.map(consolidatedCase => {
    return {
      ...consolidatedCase,
      checked: true,
    };
  });

  const initialCheckBoxValue = true;
  const initialEnabledCheckBoxValue = true;
  store.set(state.consolidatedCaseAllCheckbox, initialCheckBoxValue);
  store.set(state.initialEnabledCheckBoxValue, initialEnabledCheckBoxValue);
  store.set(state.caseDetail.consolidatedCases, consolidatedCases);
};
