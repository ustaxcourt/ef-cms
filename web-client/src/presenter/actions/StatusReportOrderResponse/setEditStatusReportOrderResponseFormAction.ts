import { state } from '@web-client/presenter/app.cerebral';

export const setEditStatusReportOrderResponseFormAction = ({
  get,
  props,
  store,
}) => {
  const { caseDetail, docketEntryIdToEdit } = props;

  const documentToEdit = get(state.documentToEdit);

  store.set(state.form, {
    additionalOrderText: documentToEdit.draftOrderState.additionalOrderText,
    docketEntryDescription:
      documentToEdit.draftOrderState.docketEntryDescription,
    dueDate: documentToEdit.draftOrderState.dueDate,
    jurisdiction: documentToEdit.draftOrderState.jurisdiction,
    orderType: documentToEdit.draftOrderState.orderType,
    strickenFromTrialSessions:
      documentToEdit.draftOrderState.strickenFromTrialSessions,
  });

  return {
    url: `/case-detail/${caseDetail.docketNumber}/documents/${docketEntryIdToEdit}/order-response`,
  };
};
