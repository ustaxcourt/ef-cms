import { put } from './requests';
import { ClientApplicationContext } from '@web-client/applicationContext';
import { CaseDTO } from '@shared/business/dto/cases/CaseDTO';

export const updateCaseDetailsInteractor = (
  applicationContext: ClientApplicationContext,
  { caseDetails, docketNumber },
): Promise<CaseDTO> => {
  return put({
    applicationContext,
    body: {
      caseDetails,
    },
    endpoint: `/case-parties/${docketNumber}/case-details`,
  });
};
