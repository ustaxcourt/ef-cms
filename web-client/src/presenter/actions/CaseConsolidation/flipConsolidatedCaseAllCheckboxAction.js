import { state } from 'cerebral';
// TODO
/**
 *
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the Cerebral get object
 * @param {object} providers.store the Cerebral store object
 */
export const flipConsolidatedCaseAllCheckboxAction = ({ get, store }) => {
  const consolidatedCaseAllCheckbox = get(state.consolidatedCaseAllCheckbox);

  let consolidatedCases = get(state.caseDetail.consolidatedCases);

  consolidatedCases = consolidatedCases.map(consolidatedCase => {
    const isLeadCase = !!(
      consolidatedCase.leadDocketNumber &&
      consolidatedCase.leadDocketNumber === consolidatedCase.docketNumber
    );

    if (isLeadCase) {
      return {
        ...consolidatedCase,
        checked: true,
      };
    }

    return {
      ...consolidatedCase,
      checked: !consolidatedCaseAllCheckbox,
    };
  });

  store.set(state.consolidatedCaseAllCheckbox, !consolidatedCaseAllCheckbox);
  store.set(state.caseDetail.consolidatedCases, consolidatedCases);
};
