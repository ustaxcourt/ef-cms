import { state } from 'cerebral';

/**
 * removes the petition document from the form.documents array for replacement
 *
 * @param {object} providers the providers object
 * @param {Function} providers.get the cerebral get function
 * @param {object} store the cerebral store object
 * @returns {void} sets the new state for form.documents
 */

export const removePetitionFromFormDocumentsAction = ({
  applicationContext,
  get,
  store,
}) => {
  const { INITIAL_DOCUMENT_TYPES } = applicationContext.getConstants();
  const documents = get(state.form.documents);
  const documentSelectedForPreview = get(
    state.currentViewMetadata.documentSelectedForPreview,
  );

  const caseDocumentsWithoutPetition = documents.filter(
    doc => doc.documentType !== INITIAL_DOCUMENT_TYPES.petition.documentType,
  );

  store.set(state.form.documents, caseDocumentsWithoutPetition);

  return { key: documentSelectedForPreview };
};
