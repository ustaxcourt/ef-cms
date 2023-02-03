import { state } from 'cerebral';

/**
 * set the value of state.form.partyType
 *
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.store the cerebral store object
 * @returns {void} sets the documentToEdit on state
 */
export const setPartyTypeAction = ({ props, store }) => {
  store.set(state.form.partyType, props.value);
};
