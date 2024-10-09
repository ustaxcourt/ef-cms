import { InvalidRequest, UnauthorizedError } from '@web-api/errors/errors';
import { JudgeActivityReportSearch } from '../../../../../shared/src/business/entities/judgeActivityReport/JudgeActivityReportSearch';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../../../shared/src/authorization/authorizationClientService';
import { RawCaseWorksheet } from '@shared/business/entities/caseWorksheet/CaseWorksheet';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { SubmittedCAVTableFields } from '@web-api/persistence/elasticsearch/getDocketNumbersByStatusAndByJudge';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';

export type GetCasesByStatusAndByJudgeRequest = {
  statuses: string[];
  judgeIds: string[];
};

export type GetCasesByStatusAndByJudgeResponse = SubmittedCAVTableFields & {
  formattedCaseCount: number;
  caseWorksheet?: RawCaseWorksheet;
};

export const getCaseWorksheetsByJudgeInteractor = async (
  applicationContext: ServerApplicationContext,
  params: GetCasesByStatusAndByJudgeRequest,
  authorizedUser: UnknownAuthUser,
): Promise<{
  cases: GetCasesByStatusAndByJudgeResponse[];
}> => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.JUDGE_ACTIVITY_REPORT)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const searchEntity = new JudgeActivityReportSearch(params);
  if (!searchEntity.isValid()) {
    throw new InvalidRequest('Invalid search terms');
  }

  const caseRecords = await getCases(applicationContext, searchEntity);

  const allCaseResults = await Promise.all(
    caseRecords.map(async caseRecord => {
      const numConsolidatedCases = await calculateNumberOfConsolidatedCases(
        applicationContext,
        caseRecord,
      );

      return {
        ...caseRecord,
        formattedCaseCount: numConsolidatedCases,
      };
    }),
  );

  return {
    cases: allCaseResults,
  };
};

const getCases = async (
  applicationContext: ServerApplicationContext,
  searchEntity: JudgeActivityReportSearch,
) => {
  const allCaseRecords = await applicationContext
    .getPersistenceGateway()
    .getDocketNumbersByStatusAndByJudge({
      applicationContext,
      params: {
        excludeMemberCases: true,
        judgeIds: searchEntity.judgeIds,
        statuses: searchEntity.statuses,
      },
    });

  const completeCaseRecords = await attachCaseWorkSheets(
    applicationContext,
    allCaseRecords,
  );

  return completeCaseRecords;
};

const calculateNumberOfConsolidatedCases = async (
  applicationContext: ServerApplicationContext,
  caseInfo: { leadDocketNumber?: string },
) => {
  if (!caseInfo.leadDocketNumber) {
    return 1;
  }

  return await applicationContext
    .getPersistenceGateway()
    .getCountOfConsolidatedCases({
      applicationContext,
      leadDocketNumber: caseInfo.leadDocketNumber,
    });
};

async function attachCaseWorkSheets(
  applicationContext: ServerApplicationContext,
  cases: SubmittedCAVTableFields[],
) {
  const caseWorksheets = await applicationContext
    .getPersistenceGateway()
    .getCaseWorksheetsByDocketNumber({
      applicationContext,
      docketNumbers: cases.map(c => c.docketNumber),
    });
  const caseWorksheetMap: Map<string, RawCaseWorksheet> = new Map();
  caseWorksheets.forEach(caseWorksheet =>
    caseWorksheetMap.set(caseWorksheet.docketNumber, caseWorksheet),
  );
  const completeCaseRecords = cases.map(aCase => {
    return {
      ...aCase,
      caseWorksheet: caseWorksheetMap.get(aCase.docketNumber)!,
    };
  });
  return completeCaseRecords;
}
