import { state } from '@web-client/presenter/app.cerebral';

export const setPrimaryDocumentFileIdPropAction = ({ get }: ActionProps) => {
  const primaryDocumentFileId = get(state.form.documentStorageId);
  return { primaryDocumentFileId };
};
