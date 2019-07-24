import { state } from 'cerebral';

/**
 * resets the state.users which is used throughout the app for storing list of users values
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store object used for clearing the users
 */
export const clearUsersAction = ({ store }) => {
  store.set(state.users, []);
};
