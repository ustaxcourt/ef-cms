import { state } from 'cerebral';

/**
 * sets props.users on the state per the provided key
 *
 * @param {object} key the key on which to set props.users
 * @returns {Function} scoped function for setting props.users on state
 */
export const setUsersByKeyAction =
  key =>
  ({ props, store }) => {
    store.set(state[key], props.users);
  };
