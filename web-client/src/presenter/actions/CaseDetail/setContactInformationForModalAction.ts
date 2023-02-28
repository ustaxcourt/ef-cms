import { state } from 'cerebral';

/**
 * sets state.contactToSeal based on the value of props.contactToSeal
 *
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.store the cerebral store
 */
export const setContactInformationForModalAction = ({ props, store }) => {
  store.set(state.contactToSeal, props.contactToSeal);
};
