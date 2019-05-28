import { state } from 'cerebral';

/**
 * resets the state.users which is used throughout the app for storing list of users values
 *
 * @param {Object} providers the providers object
 * @param {Object} providers.store the cerebral store object used for clearing the users
 */
export const clearUsersAction = ({ store }) => {
  store.set(state.users, []);
};
