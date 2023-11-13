import { state } from '@web-client/presenter/app-public.cerebral';

import { Get } from 'cerebral';
export const publicCaseDetailHeaderHelper = (get: Get) => {
  const caseDetail = get(state.caseDetail);

  return {
    caseCaption: caseDetail.caseCaption || '',
    docketNumber: caseDetail.docketNumber,
    docketNumberWithSuffix: caseDetail.docketNumberWithSuffix,
    isCaseSealed: !!caseDetail.isSealed,
  };
};
