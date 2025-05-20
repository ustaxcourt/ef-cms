import { state } from '@web-client/presenter/app.cerebral';

export const setEditMotionOrderResponseFormAction = ({
  get,
  props,
  store,
}: ActionProps) => {
  const documentToEdit = get(state.documentToEdit);
  const { caseDetail, docketEntryIdToEdit } = props;
  const pathUrl = props.parentMessageId
    ? `/messages/${caseDetail.docketNumber}/message-detail/${props.parentMessageId}/${docketEntryIdToEdit}/motion-response-order-edit`
    : `/case-detail/${caseDetail.docketNumber}/documents/${docketEntryIdToEdit}/motion-order-response-edit`;

  store.set(state.form, documentToEdit.draftOrderState);
  store.set(
    state.docketEntryId,
    documentToEdit.draftOrderState.previousDocument.docketEntryId,
  );
  return { path: pathUrl };
};
