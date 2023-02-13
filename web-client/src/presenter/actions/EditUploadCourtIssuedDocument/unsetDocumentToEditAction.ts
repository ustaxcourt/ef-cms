import { state } from 'cerebral';

/**
 * unset the document to Edit state
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store
 */
export const unsetDocumentToEditAction = ({ store }) => {
  store.unset(state.documentToEdit);
};
