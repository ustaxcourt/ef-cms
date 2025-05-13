import { InvalidRequest, UnauthorizedError } from '@web-api/errors/errors';
import { JudgeActivityReportSearch } from '@shared/business/entities/judgeActivityReport/JudgeActivityReportSearch';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { RawCaseWorksheet } from '@shared/business/entities/caseWorksheet/CaseWorksheet';
import {
  SubmittedCAVTableFields,
  getDocketNumbersByStatusAndByJudge,
} from '@web-api/persistence/postgres/cases/reports/getDocketNumbersByStatusAndByJudge';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { getConsolidatedCasesCount } from '@web-api/persistence/postgres/cases/getConsolidatedCasesCount';
import { getCaseWorksheetsByDocketNumber } from '@web-api/persistence/postgres/caseWorksheets/getCaseWorksheetsByDocketNumber';

export type GetCasesByStatusAndByJudgeRequest = {
  statuses: string[];
  judges: string[];
};

export type GetCasesByStatusAndByJudgeResponse = SubmittedCAVTableFields & {
  formattedCaseCount: number;
  caseWorksheet?: RawCaseWorksheet;
};

export const getCaseWorksheetsByJudgeInteractor = async (
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

  const caseRecords = await getCases(searchEntity);

  const allCaseResults = await Promise.all(
    caseRecords.map(async caseRecord => {
      const numConsolidatedCases =
        await calculateNumberOfConsolidatedCases(caseRecord);

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

const getCases = async (searchEntity: JudgeActivityReportSearch) => {
  const allCaseRecords = await getDocketNumbersByStatusAndByJudge({
    params: {
      excludeMemberCases: true,
      judges: searchEntity.judges,
      statuses: searchEntity.statuses,
    },
  });

  const completeCaseRecords = await attachCaseWorkSheets(allCaseRecords);

  return completeCaseRecords;
};

const calculateNumberOfConsolidatedCases = async (caseInfo: {
  leadDocketNumber?: string;
}) => {
  if (!caseInfo.leadDocketNumber) {
    return 1;
  }

  return await getConsolidatedCasesCount({
    leadDocketNumber: caseInfo.leadDocketNumber,
  });
};

async function attachCaseWorkSheets(cases: SubmittedCAVTableFields[]) {
  const caseWorksheets = await getCaseWorksheetsByDocketNumber({
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
