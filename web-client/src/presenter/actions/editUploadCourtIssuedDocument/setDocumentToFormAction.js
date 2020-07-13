import { state } from 'cerebral';

/**
 * sets the document to be edited from the current caseDetail
 *
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.store the cerebral store object
 * @returns {void} sets the document on state
 */
export const setDocumentToFormAction = ({ props, store }) => {
  const { caseDetail, documentId } = props;

  const allCaseDocuments = [
    ...(caseDetail.documents || []),
    ...(caseDetail.correspondence || []),
  ];
  const documentToSet = allCaseDocuments.find(
    document => document.documentId === documentId,
  );

  if (documentToSet) {
    store.set(state.form, {
      ...documentToSet,
      documentIdToEdit: documentId,
      primaryDocumentFile: true,
    });
  }
};
