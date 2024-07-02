import { state } from '@web-client/presenter/app.cerebral';

export const setEditStatusReportOrderResponseFormAction = ({
  get,
  props,
  store,
}) => {
  const { caseDetail, docketEntryIdToEdit } = props;

  const documentToEdit = get(state.documentToEdit);

  store.set(state.form.orderType, documentToEdit.draftOrderState.orderType);

  console.log(
    'documentToEdit.draftOrderState.dueDate',
    documentToEdit.draftOrderState.dueDate,
    typeof documentToEdit.draftOrderState.dueDate,
  );
  store.set(state.form.dueDate, documentToEdit.draftOrderState.dueDate);

  store.set(
    state.form.strickenFromTrialSessions,
    documentToEdit.draftOrderState.strickenFromTrialSessions,
  );
  store.set(
    state.form.jurisdiction,
    documentToEdit.draftOrderState.jurisdiction,
  );
  store.set(
    state.form.additionalOrderText,
    documentToEdit.draftOrderState.additionalOrderText,
  );
  store.set(
    state.form.docketEntryDescription,
    documentToEdit.draftOrderState.docketEntryDescription,
  );

  return {
    url: `/case-detail/${caseDetail.docketNumber}/documents/${docketEntryIdToEdit}/order-response`,
  };
};
