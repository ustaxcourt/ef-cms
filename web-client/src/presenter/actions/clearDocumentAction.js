import { state } from 'cerebral';

/**
 * clears the state.document
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store used for setting state.users
 * @param {object} providers.props the cerebral props object used for getting the props.users
 */
export const clearDocumentAction = ({ store }) => {
  store.set(state.document, {});
};
