import { state } from 'cerebral';

/**
 * sets the state.form from the document's draft state
 *
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.store the cerebral store object
 */
export const setFormFromDraftStateAction = ({ props, store }) => {
  const { caseDetail, docketEntryIdToEdit } = props;

  if (docketEntryIdToEdit) {
    const documentToEdit = caseDetail.docketEntries.find(
      docketEntry => docketEntry.docketEntryId === docketEntryIdToEdit,
    );

    store.set(state.form, {
      ...documentToEdit.draftOrderState,
      docketEntryIdToEdit,
      documentTitle: documentToEdit.documentTitle,
      documentType: documentToEdit.documentType,
    });
  }
};
