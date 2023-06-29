/* eslint-disable spellcheck/spell-checker */

import { state } from '@web-client/presenter/app.cerebral';

/**
 * Negates consolidatedCaseAllCheckbox and:
 * enables/disables non-lead checkboxes as appropriate
 * checks/unchecks non-lead cases as appropriate
 * sets tooltip on lead case if non-lead cases are enabled
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.get the Cerebral get object
 * @param {object} providers.store the Cerebral store object
 */
export const flipConsolidatedCaseAllCheckboxAction = ({
  applicationContext,
  get,
  store,
}: ActionProps) => {
  const { isLeadCase } = applicationContext.getUtilities();

  const allCheckboxPreviousState = get(
    state.modal.form.consolidatedCaseAllCheckbox,
  );

  let consolidatedCaseCheckBoxes = get(
    state.modal.form.consolidatedCasesToMultiDocketOn,
  );

  consolidatedCaseCheckBoxes = consolidatedCaseCheckBoxes.map(aCase => {
    if (isLeadCase(aCase)) {
      const LEAD_CASE_TOOLTIP = 'The lead case cannot be unselected';
      const displayedTooltip = allCheckboxPreviousState
        ? LEAD_CASE_TOOLTIP
        : '';
      return {
        ...aCase,
        checkboxDisabled: true,
        checked: true,
        tooltip: displayedTooltip,
      };
    }

    return {
      ...aCase,
      checkboxDisabled: !allCheckboxPreviousState,
      checked: !allCheckboxPreviousState,
    };
  });

  store.set(
    state.modal.form.consolidatedCaseAllCheckbox,
    !allCheckboxPreviousState,
  );
  store.set(
    state.modal.form.consolidatedCasesToMultiDocketOn,
    consolidatedCaseCheckBoxes,
  );
};
