import { state } from '@web-client/presenter/app.cerebral';

/**
 * sets the state.form from the document's draft state
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.store the cerebral store object
 */
export const setFormFromDraftStateAction = ({ props, store }: ActionProps) => {
  const { caseDetail, docketEntryIdToEdit, documentContents, richText } = props;

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
    store.set(state.form.documentContents, documentContents);
    store.set(state.form.richText, richText);
  }
};
