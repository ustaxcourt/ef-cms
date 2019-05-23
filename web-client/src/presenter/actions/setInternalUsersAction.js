import { state } from 'cerebral';

/**
 * sets the state.internalUsers to the props.users passed in.  the internalUsers are used for when forwarding a work item to other users.
 *
 * @param {object} providers the providers object
 * @param {Function} providers.store the cerebral store used for setting the state.internalUsers
 * @param {Function} providers.props the cerebral props object used for passing in props.users
 */
export const setInternalUsersAction = ({ store, props }) => {
  store.set(state.internalUsers, props.users);
};
