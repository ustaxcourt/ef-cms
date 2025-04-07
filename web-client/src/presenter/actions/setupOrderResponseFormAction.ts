import { MOTION_ORDER_RESPONSE_OPTIONS } from '@shared/business/entities/EntityConstants';
import { state } from '@web-client/presenter/app.cerebral';

export const setupOrderResponseFormAction = ({ store, get }: ActionProps) => {
  const caseDetail = get(state.caseDetail);
  const isOnLeadCase = caseDetail.leadDocketNumber === caseDetail.docketNumber;
  const consolidatedFiling = isOnLeadCase
    ? MOTION_ORDER_RESPONSE_OPTIONS.consolidatedGroupOrderFor.ALL_CASES
    : MOTION_ORDER_RESPONSE_OPTIONS.consolidatedGroupOrderFor.THIS_CASE_ONLY;

  store.set(state.form.consolidatedGroupOrderFor, consolidatedFiling);
};
