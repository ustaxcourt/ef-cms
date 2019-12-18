import { state } from 'cerebral';

export const publicCaseDetailHeaderHelper = get => {
  const caseDetail = get(state.caseDetail);

  return {
    caseTitle: caseDetail.caseTitle,
    docketNumber: caseDetail.docketNumber,
    docketNumberWithSuffix: `${caseDetail.docketNumber}${caseDetail.docketNumberSuffix}`,
  };
};
