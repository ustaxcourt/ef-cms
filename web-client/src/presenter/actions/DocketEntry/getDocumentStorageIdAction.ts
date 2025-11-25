import { state } from '@web-client/presenter/app.cerebral';

export const getDocumentStorageIdAction = ({ get, props }: ActionProps) => {
  const docketEntryId = props.docketEntryId || props.file.docketEntryId;

  const { docketEntries } = get(state.caseDetail);
  const { documentStorageId } = docketEntries.find(de => {
    return de.docketEntryId === docketEntryId;
  })!;

  return { documentStorageId };
};
