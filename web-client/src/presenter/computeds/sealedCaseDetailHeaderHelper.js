import { state } from 'cerebral';

export const sealedCaseDetailHeaderHelper = get => {
  const caseDetail = get(state.caseDetail);

  return {
    caseCaption: caseDetail.caseCaption || '',
    docketNumber: caseDetail.docketNumber,
    docketNumberWithSuffix: caseDetail.docketNumberWithSuffix,
    isCaseSealed: !!caseDetail.isSealed,
  };
};
