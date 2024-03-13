import { isEqual } from 'lodash';
import { state } from '@web-client/presenter/app.cerebral';

export type SelectedDocumentInfoType = {
  documentIds: { docketEntryId: string }[];
};

export const setSelectedDocumentIdAction = ({
  get,
  props,
  store,
}: ActionProps<SelectedDocumentInfoType>) => {
  const { documentIds } = props;
  const documentsSelectedForDownload = get(state.documentsSelectedForDownload);

  const allDocumentsSelected = documentIds.length > 1;
  const singleDocumentSelected = documentIds.length === 1;

  if (allDocumentsSelected) {
    if (isEqual(documentIds, documentsSelectedForDownload)) {
      store.set(state.documentsSelectedForDownload, []);
    } else {
      store.set(state.documentsSelectedForDownload, documentIds);
    }
  } else if (singleDocumentSelected) {
    const document = documentIds[0];
    const index = documentsSelectedForDownload.findIndex(
      doc => doc.docketEntryId === document.docketEntryId,
    );

    if (index !== -1) {
      documentsSelectedForDownload.splice(index, 1);
    } else {
      documentsSelectedForDownload.push(document);
    }

    store.set(state.documentsSelectedForDownload, documentsSelectedForDownload);
  }
};
