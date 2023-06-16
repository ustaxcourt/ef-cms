import { state } from '@web-client/presenter/app.cerebral';

/**
 * unset the document to Edit state
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store
 */
export const unsetDocumentToEditAction = ({ store }: ActionProps) => {
  store.unset(state.documentToEdit);
};
