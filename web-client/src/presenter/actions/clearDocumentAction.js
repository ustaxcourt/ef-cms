import { state } from 'cerebral';

/**
 * clears the state.document
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store
 * @param {object} providers.props the cerebral props object
 */
export const clearDocumentAction = ({ store }) => {
  store.set(state.document, {});
};
