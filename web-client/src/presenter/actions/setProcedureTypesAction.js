import { state } from 'cerebral';

/**
 * sets the state.procedureTypes to the props.procedureTypes passed in.  state.procedureTypes is used for displaying the select input of
 * the different procedure types (small, large).
 *
 * @param {object} providers the providers object
 * @param {Function} providers.store the cerebral store used for setting state.procedureTypes
 * @param {Function} providers.props the cerebral props object used for getting the props.procedureTypes
 */
export const setProcedureTypesAction = ({ store, props }) => {
  store.set(state.procedureTypes, props.procedureTypes);
};
