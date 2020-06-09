import { state } from 'cerebral';

/**
 * sets the case type to display to open or closed
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get function
 * @param {object} providers.store the cerebral store object
 * @returns {void}
 */
export const setCaseTypeToDisplayAction = ({ props, store }) => {
  store.set(state.openClosedCases.caseType, props.tabName);
};
