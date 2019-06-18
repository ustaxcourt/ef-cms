import { state } from 'cerebral';

/**
 * sets the state.caseTypes based on the props.caseTypes passed in
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store used for setting the state.caseTypes
 * @param {object} providers.props the cerebral props object used for passing the props.caseTypes
 */
export const setCaseTypesAction = ({ store, props }) => {
  store.set(state.caseTypes, props.caseTypes);
};
