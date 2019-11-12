import { state } from 'cerebral';

/**
 * unset state.documentId
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store used for setting state.users
 */
export const unsetDocumentIdAction = ({ store }) => {
  store.unset(state.documentId);
};
