import { getDocumentEditUrl } from '../utilities/getDocumentEditUrl';
import { state } from 'cerebral';

/**
 * sets the document to be edited from the current caseDetail
 *
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.store the cerebral store object
 * @returns {void} sets the documentToEdit on state
 */
export const setDocumentToEditAction = ({
  applicationContext,
  get,
  props,
  store,
}) => {
  const { caseDetail, documentIdToEdit } = props;
  const parentMessageId = get(state.parentMessageId);

  if (documentIdToEdit) {
    const documentToEdit = caseDetail.documents.find(
      document => document.documentId === documentIdToEdit,
    );

    // TODO - refactor for clarity
    const draftState = documentToEdit.draftState || {};
    draftState.documentIdToEdit = documentIdToEdit;
    draftState.documentType = documentToEdit.documentType;
    draftState.documentTitle = documentToEdit.documentTitle;

    store.set(state.documentToEdit, documentToEdit);
    store.set(state.form, draftState);

    let editUrl = getDocumentEditUrl({
      applicationContext,
      caseDetail,
      document: documentToEdit,
    });

    if (parentMessageId) {
      editUrl += `/${parentMessageId}`;
    }

    return {
      path: editUrl,
    };
  }
};
