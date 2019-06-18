import { state } from 'cerebral';

/**
 * sets the state.cases based on the props.caseList passed in
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store used for setting the state.cases
 * @param {object} providers.props the cerebral props object used for passing the props.caseList
 */
export const setCasesAction = ({ store, props }) => {
  store.set(state.cases, props.caseList);
};
