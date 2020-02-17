import { state } from 'cerebral';

/**
 * sets consolidated cases for the current case in state
 *
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.store the cerebral store
 * @returns {void}
 */
export const setConsolidatedCasesForCaseAction = ({ props, store }) => {
  const { consolidatedCases } = props;
  store.set(state.caseDetail.consolidatedCases, consolidatedCases);
};
