import { state } from '@web-client/presenter/app.cerebral';

export const publicCaseDetailHeaderHelper = get => {
  const caseDetail = get(state.caseDetail);

  return {
    caseCaption: caseDetail.caseCaption || '',
    docketNumber: caseDetail.docketNumber,
    docketNumberWithSuffix: caseDetail.docketNumberWithSuffix,
    isCaseSealed: !!caseDetail.isSealed,
  };
};
