import { RawCaseWorksheet } from '@shared/business/entities/caseWorksheet/CaseWorksheet';
import { formatPositiveNumber } from '@shared/business/utilities/formatPositiveNumber';
import { state } from '@web-client/presenter/app.cerebral';

type CaseWorksheetTableRow = RawCase & {
  worksheet: RawCaseWorksheet;
  consolidatedIconTooltipText: string;
  isLeadCase: boolean;
  inConsolidatedGroup: boolean;
  formattedCaseCount: number;
  daysElapsedSinceLastStatusChange: number;
  formattedSubmittedCavStatusChangedDate: string;
};

interface ICaseWorksheetsHelper {
  caseWorksheetsFormatted: CaseWorksheetTableRow[];
}

export const caseWorksheetsHelper = (
  get: any,
  applicationContext: IApplicationContext,
): ICaseWorksheetsHelper => {
  const { isLeadCase } = applicationContext.getUtilities();

  const {
    consolidatedCasesGroupCountMap,
    submittedAndCavCasesByJudge = [],
    worksheets = [],
  } = get(state.submittedAndCavCases);

  const worksheetsObj: { [docketNumber: string]: RawCaseWorksheet } = {};
  worksheets.forEach(ws => (worksheetsObj[ws.docketNumber] = ws));

  const today = applicationContext
    .getUtilities()
    .formatDateString(
      applicationContext.getUtilities().prepareDateFromString(),
      applicationContext.getConstants().DATE_FORMATS.ISO,
    );

  const caseWorksheetsFormatted = submittedAndCavCasesByJudge.map(aCase => {
    const formattedCaseCount =
      consolidatedCasesGroupCountMap[aCase.docketNumber] || 1;

    const formattedSubmittedCavStatusDate = getSubmittedOrCAVDate(
      applicationContext,
      aCase.caseStatusHistory,
    );

    const lastStatusChange = aCase.caseStatusHistory.slice(-1)[0].date;
    const daysSinceLastStatusChange = applicationContext
      .getUtilities()
      .calculateDifferenceInDays(today, lastStatusChange);

    return {
      caseCaption: aCase.caseCaption,
      consolidatedIconTooltipText: isLeadCase(aCase) ? 'Lead case' : '',
      daysSinceLastStatusChange: formatPositiveNumber(
        daysSinceLastStatusChange,
      ),
      docketNumber: aCase.docketNumber,
      docketNumberWithSuffix: aCase.docketNumberWithSuffix,
      formattedCaseCount,
      formattedSubmittedCavStatusDate,
      inConsolidatedGroup: !!isLeadCase(aCase),
      isLeadCase: isLeadCase(aCase),
      status: aCase.status,
      worksheet: worksheetsObj[aCase.docketNumber] || {},
    };
  });

  caseWorksheetsFormatted.sort((a, b) => {
    return b.daysSinceLastStatusChange - a.daysSinceLastStatusChange;
  });

  return {
    caseWorksheetsFormatted,
  };
};

const getSubmittedOrCAVDate = (
  applicationContext: IApplicationContext,
  caseStatusHistory: { updatedCaseStatus: string; date: string }[],
): string => {
  const foundDate = caseStatusHistory.find(statusHistory =>
    ['Submitted', 'CAV'].includes(statusHistory.updatedCaseStatus),
  )?.date;

  if (!foundDate) return '';

  return applicationContext
    .getUtilities()
    .formatDateString(
      foundDate,
      applicationContext.getConstants().DATE_FORMATS.MMDDYY,
    );
};
