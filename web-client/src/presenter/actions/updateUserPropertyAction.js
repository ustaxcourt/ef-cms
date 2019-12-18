import { state } from 'cerebral';

/**
 * sets the state.users to the props.value passed in.
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store used for setting state.users
 * @param {object} providers.props the cerebral props object used for getting the props.users
 */
export const updateUserPropertyAction = ({ props, store }) => {
  store.set(state.user[props.key], props.value);
};
