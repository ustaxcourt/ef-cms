import { state } from '@web-client/presenter/app.cerebral';

/**
 * removes the petition document from the form.docketEntries array for replacement
 * @param {object} providers the providers object
 * @param {Function} providers.get the cerebral get function
 * @param {object} store the cerebral store object
 * @returns {void} sets the new state for form.docketEntries
 */

export const removePetitionFromFormDocumentsAction = ({
  get,
  store,
}: ActionProps) => {
  const documents = get(state.form.docketEntries);

  documents.some(({ documentType }, idx) => {
    if (documentType === 'Petition') {
      documents.splice(idx, 1);
      return true;
    }
  });

  store.set(state.form.docketEntries, documents);
};
