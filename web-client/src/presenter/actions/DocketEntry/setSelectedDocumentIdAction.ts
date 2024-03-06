import { state } from '@web-client/presenter/app.cerebral';

export const setSelectedDocumentIdAction = ({
  get,
  props,
  store,
}: ActionProps<{
  documentIds: string[];
}>) => {
  const { documentIds } = props;
  let documentsSelectedForDownload = get(state.documentsSelectedForDownload);

  if (documentIds.length > 1) {
    console.log(
      'documentsSelectedForDownload in action',
      documentsSelectedForDownload,
    );
    //   const docketEntries = get(
    //     state.formattedDocketEntries.formattedDocketEntriesOnDocketRecord,
    //   );
    //   const documentIds = docketEntries.map(
    //     docketEntry => docketEntry.docketEntryId,
    //   );
    //   if (documentIds === documentsSelectedForDownload) {
    //     store.set(state.documentsSelectedForDownload, []);
    //   } else {
    //     store.set(state.documentsSelectedForDownload, documentIds);
    //   }
  } else {
    const documentId = documentIds[0];
    const index = documentsSelectedForDownload.indexOf(documentId);

    if (index !== -1) {
      documentsSelectedForDownload.splice(index, 1);
    } else {
      documentsSelectedForDownload.push(documentId);
    }

    store.set(state.documentsSelectedForDownload, documentsSelectedForDownload);
  }
};
