import { state } from '@web-client/presenter/app.cerebral';

import { ClientApplicationContext } from '@web-client/applicationContext';
import { Get } from '../../utilities/cerebralWrapper';
export const sealedCaseDetailHelper = (
  get: Get,
  applicationContext: ClientApplicationContext,
): any => {
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
