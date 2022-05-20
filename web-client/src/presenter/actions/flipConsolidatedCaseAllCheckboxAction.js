import { state } from 'cerebral';

/**
 * fill me in
 */
export const flipConsolidatedCaseAllCheckboxAction = ({
  get,
  props,
  store,
}) => {
  const consolidatedCaseAllCheckbox = get(state.consolidatedCaseAllCheckbox);
  const initialEnabledCheckboxValue = get(state.initialEnabledCheckboxValue);

  store.set(state.consolidatedCaseAllCheckbox, !consolidatedCaseAllCheckbox);
  store.set(state.initialEnabledCheckboxValue, !initialEnabledCheckboxValue);

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

  store.set(state.caseDetail.consolidatedCases, consolidatedCases);
};
