import { state } from 'cerebral';

/**
 * sets the state.openCases and state.closedCases based on the props.openCaseList and props.closedCaseList passed in
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store used for setting the state.openCases and state.closedCases
 * @param {object} providers.props the cerebral props object used for passing the props.closedCaseList and props.openCaseList
 */
export const setCasesAction = ({ props, store }) => {
  store.set(state.openCases, props.openCaseList);
  store.set(state.closedCases, props.closedCaseList);
};
