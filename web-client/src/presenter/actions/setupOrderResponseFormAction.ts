import { CONSOLIDATED_GROUP_ORDER_FOR } from '@shared/business/entities/EntityConstants';
import { state } from '@web-client/presenter/app.cerebral';

export const setupOrderResponseFormAction = ({ store, get }: ActionProps) => {
  const caseDetail = get(state.caseDetail);
  const isOnLeadCase = caseDetail.leadDocketNumber === caseDetail.docketNumber;
  const consolidatedFiling = isOnLeadCase
    ? CONSOLIDATED_GROUP_ORDER_FOR.ALL_CASES
    : CONSOLIDATED_GROUP_ORDER_FOR.THIS_CASE_ONLY;

  store.set(state.form.consolidatedGroupOrderFor, consolidatedFiling);
};
