import { state } from '@web-client/presenter/app.cerebral';

export const setSelectedDocumentIdAction = ({
  get,
  props,
  store,
}: ActionProps<{
  documentId: string;
}>) => {
  const { documentId } = props;

  const documentsSelectedForDownload = get(state.documentsSelectedForDownload);
  const index = documentsSelectedForDownload.indexOf(documentId);

  if (index !== -1) {
    documentsSelectedForDownload.splice(index, 1);
  } else {
    documentsSelectedForDownload.push(documentId);
  }

  store.set(state.documentsSelectedForDownload, documentsSelectedForDownload);
};
