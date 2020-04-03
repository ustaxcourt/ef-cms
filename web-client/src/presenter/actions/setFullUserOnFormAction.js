import { state } from 'cerebral';

/**
 * sets the state.form to the entire props.user passed in (used for internal users editing users, including private fields)
 *
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object used for getting the props.user
 * @param {object} providers.store the cerebral store used for setting state.form
 * @returns {Promise} async action
 *
 */
export const setFullUserOnFormAction = async ({ props, store }) => {
  store.set(state.form, props.user);
};
