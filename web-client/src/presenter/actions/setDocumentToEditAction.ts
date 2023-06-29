import { state } from '@web-client/presenter/app.cerebral';

/**
 * sets the document to be edited from the current caseDetail
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.store the cerebral store object
 * @returns {void} sets the documentToEdit on state
 */
export const setDocumentToEditAction = ({ props, store }: ActionProps) => {
  const { caseDetail, docketEntryIdToEdit } = props;

  if (docketEntryIdToEdit) {
    const documentToEdit = caseDetail.docketEntries.find(
      docketEntry => docketEntry.docketEntryId === docketEntryIdToEdit,
    );

    store.set(state.documentToEdit, documentToEdit);
  }
};
