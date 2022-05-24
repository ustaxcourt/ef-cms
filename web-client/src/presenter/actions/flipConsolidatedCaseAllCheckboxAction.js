import { state } from 'cerebral';
// TODO
/**
 * fill me in
 */
export const flipConsolidatedCaseAllCheckboxAction = ({ get, store }) => {
  const consolidatedCaseAllCheckbox = get(state.consolidatedCaseAllCheckbox);
  const initialEnabledCheckboxValue = get(state.initialEnabledCheckboxValue);

  let consolidatedCases = get(state.caseDetail.consolidatedCases);

  consolidatedCases = consolidatedCases.map(consolidatedCase => {
    const isLeadCase = !!(
      consolidatedCase.leadDocketNumber &&
      consolidatedCase.leadDocketNumber === consolidatedCase.docketNumber
    );

    if (isLeadCase) {
      return consolidatedCase;
    }

    return {
      ...consolidatedCase,
      checked: !consolidatedCaseAllCheckbox,
    };
  });

  store.set(state.consolidatedCaseAllCheckbox, !consolidatedCaseAllCheckbox);
  store.set(state.initialEnabledCheckboxValue, !initialEnabledCheckboxValue);
  store.set(state.caseDetail.consolidatedCases, consolidatedCases);
};
