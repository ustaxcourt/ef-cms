import { state } from 'cerebral';

/**
 * sets the state.form to the props.user passed in.
 *
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object used for getting the props.user
 * @param {object} providers.store the cerebral store used for setting state.form
 */
export const setUserOnFormAction = ({ props, store }) => {
  store.set(state.form, {
    barNumber: props.user.barNumber,
    contact: props.user.contact,
    firmName: props.user.firmName,
    name: props.user.name,
  });
};
