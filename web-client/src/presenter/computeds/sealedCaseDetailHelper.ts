import { state } from '@web-client/presenter/app.cerebral';

export const sealedCaseDetailHelper = (get, applicationContext) => {
  const caseDetail = get(state.caseDetail);
  const isCaseSealed = applicationContext
    .getUtilities()
    .isSealedCase(caseDetail);

  return {
    caseCaption: caseDetail.caseCaption || '',
    docketNumber: caseDetail.docketNumber,
    docketNumberWithSuffix: caseDetail.docketNumberWithSuffix,
    isCaseSealed: !!isCaseSealed,
  };
};
