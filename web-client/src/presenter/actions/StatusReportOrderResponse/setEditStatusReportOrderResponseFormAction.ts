import { state } from '@web-client/presenter/app.cerebral';

export const setEditStatusReportOrderResponseFormAction = ({
  get,
  props,
  store,
}: ActionProps): { path: string } => {
  const { caseDetail, docketEntryIdToEdit } = props;

  const documentToEdit = get(state.documentToEdit);
  const pathUrl = props.parentMessageId
    ? `/messages/${caseDetail.docketNumber}/message-detail/${props.parentMessageId}/${docketEntryIdToEdit}/order-response-edit`
    : `/case-detail/${caseDetail.docketNumber}/documents/${docketEntryIdToEdit}/order-response-edit`;

  store.set(state.form, {
    additionalOrderText: documentToEdit.draftOrderState.additionalOrderText,
    docketEntryDescription:
      documentToEdit.draftOrderState.docketEntryDescription,
    dueDate: documentToEdit.draftOrderState.dueDate,
    issueOrder: documentToEdit.draftOrderState.issueOrder,
    jurisdiction: documentToEdit.draftOrderState.jurisdiction,
    orderType: documentToEdit.draftOrderState.orderType,
    strickenFromTrialSessions:
      documentToEdit.draftOrderState.strickenFromTrialSessions,
  });

  return {
    path: pathUrl,
  };
};
