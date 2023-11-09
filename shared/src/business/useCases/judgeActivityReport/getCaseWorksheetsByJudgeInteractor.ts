import { InvalidRequest, UnauthorizedError } from '@web-api/errors/errors';
import { JudgeActivityReportSearch } from '../../entities/judgeActivityReport/JudgeActivityReportSearch';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import { RawCaseWorksheet } from '@shared/business/entities/caseWorksheet/CaseWorksheet';
import { SubmittedCAVTableFields } from '@web-api/persistence/elasticsearch/getDocketNumbersByStatusAndByJudge';

export type GetCasesByStatusAndByJudgeRequest = {
  statuses: string[];
  judges: string[];
};

export type GetCasesByStatusAndByJudgeResponse = SubmittedCAVTableFields & {
  formattedCaseCount: number;
  caseWorksheet?: RawCaseWorksheet;
};

export const getCaseWorksheetsByJudgeInteractor = async (
  applicationContext: IApplicationContext,
  params: GetCasesByStatusAndByJudgeRequest,
): Promise<{
  cases: GetCasesByStatusAndByJudgeResponse[];
}> => {
  const authorizedUser = applicationContext.getCurrentUser();

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
  applicationContext: IApplicationContext,
  searchEntity: JudgeActivityReportSearch,
) => {
  const allCaseRecords = await applicationContext
    .getPersistenceGateway()
    .getDocketNumbersByStatusAndByJudge({
      applicationContext,
      params: {
        excludeMemberCases: true,
        judges: searchEntity.judges,
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
  applicationContext: IApplicationContext,
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
  applicationContext: IApplicationContext,
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
