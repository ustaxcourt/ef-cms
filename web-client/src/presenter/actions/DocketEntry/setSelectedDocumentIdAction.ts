import { isEqual } from 'lodash';
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

  // todo: Is there a better way to represent multi-selection that checking the length of the array?
  if (documentIds.length > 1) {
    if (isEqual(documentIds, documentsSelectedForDownload)) {
      store.set(state.documentsSelectedForDownload, []);
    } else {
      store.set(state.documentsSelectedForDownload, documentIds);
    }
  } else if (documentIds.length === 1) {
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
