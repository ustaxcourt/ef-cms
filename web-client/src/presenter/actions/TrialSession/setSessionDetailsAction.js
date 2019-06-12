import { state } from 'cerebral';

/**
 * sets the state.session
 *
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object containing the props.session
 * @param {object} providers.store the cerebral store used for setting the state.session
 */
export const setSessionDetailsAction = ({ store, props }) => {
  store.set(state.session, props.session);
};
