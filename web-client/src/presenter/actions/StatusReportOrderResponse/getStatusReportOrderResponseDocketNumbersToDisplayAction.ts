import { state } from '@web-client/presenter/app.cerebral';

export const getStatusReportOrderResponseDocketNumbersToDisplayAction = ({
  get,
  store,
}: ActionProps) => {
  const caseDetail = get(state.caseDetail);
  const isLeadCase = caseDetail.leadDocketNumber === caseDetail.docketNumber;

  let docketNumbersToDisplay = [caseDetail.docketNumber];

  if (isLeadCase) {
    const docketNumbers = caseDetail.consolidatedCases.map(c => c.docketNumber);
    docketNumbersToDisplay = docketNumbers.sort();
  }

  store.set(
    state.statusReportOrderResponse.docketNumbersToDisplay,
    docketNumbersToDisplay,
  );
};
