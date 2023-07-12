import { state } from 'cerebral';
/**
 * unsets state.documentId
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store object
 */
export const unsetDocumentIdAction = ({ store }: ActionProps) => {
  store.unset(state.documentId);
};
