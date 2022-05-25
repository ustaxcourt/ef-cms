import { state } from 'cerebral';

/**
 * Negates consolidatedCaseAllCheckbox and:
 *   enables/disables non-lead checkboxes as appropriate
 *   checks/unchecks non-lead cases as appropriate
 *   sets tooltip on lead case if non-lead cases are enabled
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the Cerebral get object
 * @param {object} providers.store the Cerebral store object
 */
export const flipConsolidatedCaseAllCheckboxAction = ({ get, store }) => {
  const allCheckboxPreviousState = get(state.consolidatedCaseAllCheckbox);

  let consolidatedCases = get(state.caseDetail.consolidatedCases);

  consolidatedCases = consolidatedCases.map(consolidatedCase => {
    const isLeadCase = !!(
      consolidatedCase.leadDocketNumber &&
      consolidatedCase.leadDocketNumber === consolidatedCase.docketNumber
    );

    if (isLeadCase) {
      const LEAD_CASE_TOOLTIP = 'Lead case cannot be unselected';
      const displayedTooltip = allCheckboxPreviousState
        ? LEAD_CASE_TOOLTIP
        : '';
      return {
        ...consolidatedCase,
        checkboxDisabled: true,
        checked: true,
        tooltip: displayedTooltip,
      };
    }

    return {
      ...consolidatedCase,
      checkboxDisabled: !allCheckboxPreviousState,
      checked: !allCheckboxPreviousState,
      tooltip: '',
    };
  });

  store.set(state.consolidatedCaseAllCheckbox, !allCheckboxPreviousState);
  store.set(state.caseDetail.consolidatedCases, consolidatedCases);
};
