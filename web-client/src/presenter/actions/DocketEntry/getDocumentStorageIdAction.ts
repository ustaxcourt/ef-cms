import { state } from '@web-client/presenter/app.cerebral';
import { getDocumentStorageId } from '@shared/business/utilities/getDocumentStorageId';

export const getDocumentStorageIdAction = ({ get, props }: ActionProps) => {
  const docketEntryId = props.docketEntryId || props.file?.docketEntryId;

  const caseDetail = get(state.caseDetail);

  const documentStorageId = getDocumentStorageId({ caseDetail, docketEntryId });

  return { documentStorageId };
};
