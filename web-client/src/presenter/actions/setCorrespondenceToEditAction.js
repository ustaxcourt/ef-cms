import { state } from 'cerebral';

/**
 * sets the correspondence to be edited from the current caseDetail
 *
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.store the cerebral store object
 * @returns {void} sets the documentToEdit on state
 */
export const setCorrespondenceToEditAction = ({ props, store }) => {
  const { caseDetail, documentToEditId } = props;

  if (documentToEditId) {
    const documentToEdit = caseDetail.correspondence.find(
      document => document.documentId === documentToEditId,
    );

    store.set(state.documentId, documentToEdit.documentId);
    store.set(state.documentToEdit, documentToEdit);
    store.set(state.form.freeText, documentToEdit.documentTitle);
  }
};
