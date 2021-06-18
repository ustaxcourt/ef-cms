import { state } from 'cerebral';

/**
 * sets the state.user to the props.users passed in.
 * This will also store the user into local storage.
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store used for setting state.user
 * @param {object} providers.props the cerebral props object used for getting the props.user
 * @param {object} providers.applicationContext the application context needed for getting the setCurrentUser method
 * @returns {Promise} async action
 */
export const setUserAction = async ({ applicationContext, props, store }) => {
  store.set(state.user, props.user);
  applicationContext.setCurrentUser(props.user);
  await applicationContext.getUseCases().setItemInteractor(applicationContext, {
    key: 'user',
    value: props.user,
  });
};
