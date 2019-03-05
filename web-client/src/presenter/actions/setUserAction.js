import { state } from 'cerebral';

/**
 * sets the state.user to the props.users passed in.
 * This will also store the user into local storage.
 *
 * @param {Object} providers the providers object
 * @param {Object} providers.store the cerebral store used for setting state.user
 * @param {Object} providers.props the cerebral props object used for getting the props.user
 * @param {Object} providers.applicationContext the application context needed for getting the setCurrentUser method
 */
export const setUserAction = ({ store, props, applicationContext }) => {
  store.set(state.user, props.user);
  applicationContext.setCurrentUser(props.user);
  window.localStorage.setItem('user', JSON.stringify(props.user));
};
