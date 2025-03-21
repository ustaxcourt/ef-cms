import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { getColdCases } from '@web-api/persistence/elasticsearch/getColdCases';
import { applicationContext } from '@web-api/applicationContext';

export type ColdCaseEntry = {
  createdAt: string;
  preferredTrialCity: string;
  docketNumber: string;
  caseType: string;
  filingDate: string;
  eventCode: string;
  leadDocketNumber: string;
};

export const coldCaseReportInteractor = async (
  authorizedUser: UnknownAuthUser,
): Promise<ColdCaseEntry[]> => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.COLD_CASE_REPORT)) {
    throw new UnauthorizedError(
      'Unauthorized for viewing the cold case report data',
    );
  }

  const coldCases = await getColdCases({ applicationContext });

  return coldCases;
};
