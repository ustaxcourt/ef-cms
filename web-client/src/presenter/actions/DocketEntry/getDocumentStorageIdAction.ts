import { state } from '@web-client/presenter/app.cerebral';

export const getDocumentStorageIdAction = ({ get, props }: ActionProps) => {
  const docketEntryId = props.docketEntryId || props.file.docketEntryId;

  if (!docketEntryId) {
    return {};
  }

  const { docketEntries } = get(state.caseDetail);
  const docketEntry = docketEntries.find(de => {
    return de.docketEntryId === docketEntryId;
  });

  if (!docketEntry) {
    return {};
  }

  return { documentStorageId: docketEntry.documentStorageId };
};
