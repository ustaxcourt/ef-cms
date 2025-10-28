import { state } from '@web-client/presenter/app.cerebral';
import { isLeadCase } from '@shared/business/entities/cases/Case';

export const getStatusReportOrderDocketNumbersToDisplayAction = ({
  get,
  store,
}: ActionProps) => {
  const caseDetail = get(state.caseDetail);
  const isLeadCaseResult = isLeadCase(caseDetail);

  let docketNumbersToDisplay = [caseDetail.docketNumber];

  if (isLeadCaseResult) {
    const docketNumbers = caseDetail.consolidatedCases.map(c => c.docketNumber);
    docketNumbersToDisplay = docketNumbers.sort();
  }

  store.set(
    state.statusReportOrder.docketNumbersToDisplay,
    docketNumbersToDisplay,
  );
};
