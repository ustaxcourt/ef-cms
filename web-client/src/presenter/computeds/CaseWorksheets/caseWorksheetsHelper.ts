import { CAV_AND_SUBMITTED_CASE_STATUS } from '@shared/business/entities/EntityConstants';
import { ClientApplicationContext } from '@web-client/applicationContext';
import { Get } from 'cerebral';
import { RawCaseWorksheet } from '@shared/business/entities/caseWorksheet/CaseWorksheet';
import { formatPositiveNumber } from '@shared/business/utilities/formatPositiveNumber';
import { state } from '@web-client/presenter/app.cerebral';

type CaseWorksheetTableRow = RawCase & {
  worksheet: RawCaseWorksheet;
  consolidatedIconTooltipText: string;
  isLeadCase: boolean;
  inConsolidatedGroup: boolean;
  formattedCaseCount: number;
  daysSinceLastStatusChange: number;
  formattedSubmittedCavStatusChangedDate: string;
};

interface ICaseWorksheetsHelper {
  caseWorksheetsFormatted: CaseWorksheetTableRow[];
}

export const caseWorksheetsHelper = (
  get: Get,
  applicationContext: ClientApplicationContext,
): ICaseWorksheetsHelper => {
  const { isLeadCase } = applicationContext.getUtilities();

  const { submittedAndCavCasesByJudge = [], worksheets = [] } = get(
    state.submittedAndCavCases,
  );

  const worksheetsObj: { [docketNumber: string]: RawCaseWorksheet } = {};
  worksheets.forEach(ws => {
    worksheetsObj[ws.docketNumber] = {
      ...ws,
      finalBriefDueDateFormatted: applicationContext
        .getUtilities()
        .formatDateString(
          ws.finalBriefDueDate,
          applicationContext.getConstants().DATE_FORMATS.MMDDYY,
        ),
    };
  });

  const caseWorksheetsFormatted = submittedAndCavCasesByJudge.map(aCase => {
    const { daysElapsedSinceLastStatusChange, statusDate } = applicationContext
      .getUtilities()
      .calculateDaysElapsedSinceLastStatusChange(applicationContext, aCase);

    return {
      caseCaption: aCase.caseCaption,
      consolidatedIconTooltipText: isLeadCase(aCase) ? 'Lead case' : '',
      daysSinceLastStatusChange: formatPositiveNumber(
        daysElapsedSinceLastStatusChange,
      ),
      docketNumber: aCase.docketNumber,
      docketNumberWithSuffix: aCase.docketNumberWithSuffix,
      formattedCaseCount: aCase.formattedCaseCount,
      formattedSubmittedCavStatusDate: statusDate,
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

export const getSubmittedOrCAVDate = (
  applicationContext: IApplicationContext,
  caseStatusHistory: { updatedCaseStatus: string; date: string }[],
): string => {
  const foundDate = caseStatusHistory.find(statusHistory =>
    CAV_AND_SUBMITTED_CASE_STATUS.includes(statusHistory.updatedCaseStatus),
  )?.date;

  if (!foundDate) return '';

  return applicationContext
    .getUtilities()
    .formatDateString(
      foundDate,
      applicationContext.getConstants().DATE_FORMATS.MMDDYY,
    );
};
