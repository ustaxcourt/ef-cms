import { state } from 'cerebral';
/**
 * flips the value of checkbox for each case
 *
 * @param {object} get the cerebral get object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.props the cerebral props object
 * @returns {Promise} async action
 */

export const updateCaseCheckboxAction = ({ get, props, store }) => {
  let consolidatedCases = get(state.caseDetail.consolidatedCases);

  consolidatedCases = consolidatedCases.map(consolidatedCase => {
    if (consolidatedCase.docketNumber === props.docketNumber) {
      return {
        ...consolidatedCase,
        checked: !consolidatedCase.checked,
      };
    }

    return consolidatedCase;
  });

  store.set(state.caseDetail.consolidatedCases, consolidatedCases);
};
