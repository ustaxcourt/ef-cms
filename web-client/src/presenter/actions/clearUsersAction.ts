import { state } from '@web-client/presenter/app.cerebral';

/**
 * resets the state.users which is used throughout the app for storing list of users values
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store object used for clearing the users
 */
export const clearUsersAction = ({ store }: ActionProps) => {
  store.set(state.users, []);
};
