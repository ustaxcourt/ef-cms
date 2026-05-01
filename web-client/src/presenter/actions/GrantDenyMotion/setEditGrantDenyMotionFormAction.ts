import { isLeadCase } from '@shared/business/entities/cases/Case';
import { state } from '@web-client/presenter/app.cerebral';

export const setEditGrantDenyMotionFormAction = ({
  get,
  props,
  store,
}: ActionProps): { path: string } => {
  const { caseDetail, docketEntryIdToEdit } = props;
  const documentToEdit = get(state.documentToEdit);
  const draftOrderState = documentToEdit.draftOrderState || {};

  const pathUrl = props.parentMessageId
    ? `/messages/${caseDetail.docketNumber}/message-detail/${props.parentMessageId}/${docketEntryIdToEdit}/grant-deny-motion-edit`
    : `/case-detail/${caseDetail.docketNumber}/documents/${docketEntryIdToEdit}/grant-deny-motion-edit`;

  store.set(state.form, {
    additionalOrderText: draftOrderState.additionalOrderText || [],
    deniedAsMoot: draftOrderState.deniedAsMoot,
    deniedWithoutPrejudice: draftOrderState.deniedWithoutPrejudice,
    disposition: draftOrderState.disposition,
    dueDate: draftOrderState.dueDate,
    dueDateMessage: draftOrderState.dueDateMessage,
    filingParty: draftOrderState.filingParty,
    isOnLeadCase: isLeadCase(get(state.caseDetail)),
    issueOrder: draftOrderState.issueOrder,
    jurisdiction: draftOrderState.jurisdiction,
    strickenFromTrialSession: draftOrderState.strickenFromTrialSession,
  });

  return { path: pathUrl };
};
