import { state } from '@web-client/presenter/app.cerebral';

export const setEditMotionOrderResponseFormAction = ({
  get,
  props,
  store,
}: ActionProps) => {
  const documentToEdit = get(state.documentToEdit);
  const { draftOrderState } = documentToEdit;
  const { caseDetail, docketEntryIdToEdit } = props;
  const pathUrl = props.parentMessageId
    ? `/messages/${caseDetail.docketNumber}/message-detail/${props.parentMessageId}/${docketEntryIdToEdit}/motion-order-response-edit`
    : `/case-detail/${caseDetail.docketNumber}/documents/${docketEntryIdToEdit}/motion-order-response-edit`;

  const { additionalOrderText: legacyAdditionalOrderText, ...draftFields } =
    draftOrderState;

  store.set(state.form, {
    ...draftFields,
    additionalOrderTextArray:
      draftOrderState.additionalOrderTextArray ||
      (legacyAdditionalOrderText ? [legacyAdditionalOrderText] : ['']),
  });
  store.set(
    state.docketEntryId,
    documentToEdit.draftOrderState.previousDocument.docketEntryId,
  );
  return { path: pathUrl };
};
