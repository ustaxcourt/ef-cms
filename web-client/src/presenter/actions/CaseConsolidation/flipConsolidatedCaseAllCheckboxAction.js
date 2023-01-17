/* eslint-disable spellcheck/spell-checker */
import { state } from 'cerebral';

/**
 * Negates consolidatedCaseAllCheckbox and:
 *   enables/disables non-lead checkboxes as appropriate
 *   checks/unchecks non-lead cases as appropriate
 *   sets tooltip on lead case if non-lead cases are enabled
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.get the Cerebral get object
 * @param {object} providers.store the Cerebral store object
 */
export const flipConsolidatedCaseAllCheckboxAction = ({
  applicationContext,
  get,
  store,
}) => {
  const allCheckboxPreviousState = get(
    state.modal.form.consolidatedCaseAllCheckbox,
  );

  let consolidatedCases = get(
    state.modal.form.consolidatedCasesToMultiDocketOn,
  );

  consolidatedCases = consolidatedCases.map(consolidatedCase => {
    const isLeadCase = applicationContext
      .getUtilities()
      .isLeadCase(consolidatedCase);

    if (isLeadCase) {
      const LEAD_CASE_TOOLTIP = 'The lead case cannot be unselected';
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

  store.set(
    state.modal.form.consolidatedCaseAllCheckbox,
    !allCheckboxPreviousState,
  );
  store.set(
    state.modal.form.consolidatedCasesToMultiDocketOn,
    consolidatedCases,
  );
};
