import { state } from '@web-client/presenter/app.cerebral';

/**
 * update the upload form for submission
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store
 * @param {object} providers.get the get function
 */
export const setupUploadMetadataAction = ({ get, store }: ActionProps) => {
  store.set(state.form.documentTitle, get(state.form.generatedDocumentTitle));
};
