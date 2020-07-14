import { state } from 'cerebral';

/**
 * sets the state.form from the document's draft state
 *
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.store the cerebral store object
 */
export const setFormFromDraftStateAction = ({ props, store }) => {
  const { caseDetail, documentIdToEdit } = props;

  if (documentIdToEdit) {
    const documentToEdit = caseDetail.documents.find(
      document => document.documentId === documentIdToEdit,
    );

    store.set(state.form, {
      ...documentToEdit.draftState,
      documentIdToEdit,
      documentTitle: documentToEdit.documentTitle,
      documentType: documentToEdit.documentType,
    });
  }
};
