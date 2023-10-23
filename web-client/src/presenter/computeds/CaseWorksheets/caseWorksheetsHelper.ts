import { ClientApplicationContext } from '@web-client/applicationContext';
import { Get } from 'cerebral';
import { RawCaseWorksheet } from '@shared/business/entities/caseWorksheet/CaseWorksheet';
import { formatPositiveNumber } from '@shared/business/utilities/formatPositiveNumber';
import { state } from '@web-client/presenter/app.cerebral';

type CaseWorksheetTableRow = {
  worksheet?: RawCaseWorksheet;
  consolidatedIconTooltipText: string;
  isLeadCase: boolean;
  inConsolidatedGroup: boolean;
  formattedCaseCount: number;
  daysSinceLastStatusChange: string;
  caseCaption: string;
  docketNumber: string;
  docketNumberWithSuffix: string;
  formattedSubmittedCavStatusDate: string;
  finalBriefDueDateFormatted: string;
  status: string;
};

type CaseWorksheetsHelper = {
  caseWorksheetsFormatted: CaseWorksheetTableRow[];
};

export const caseWorksheetsHelper = (
  get: Get,
  applicationContext: ClientApplicationContext,
): CaseWorksheetsHelper => {
  const { isLeadCase } = applicationContext.getUtilities();

  const { submittedAndCavCasesByJudge = [] } = get(state.submittedAndCavCases);

  const caseWorksheetsFormatted = submittedAndCavCasesByJudge
    .map(aCase => {
      const { daysElapsedSinceLastStatusChange, statusDate } =
        applicationContext
          .getUtilities()
          .calculateDaysElapsedSinceLastStatusChange(applicationContext, aCase);

      const finalBriefDueDateFormatted = aCase.caseWorksheet?.finalBriefDueDate
        ? applicationContext
            .getUtilities()
            .formatDateString(
              aCase.caseWorksheet.finalBriefDueDate,
              applicationContext.getConstants().DATE_FORMATS.MMDDYY,
            )
        : '';

      return {
        caseCaption: aCase.caseCaption,
        consolidatedIconTooltipText: isLeadCase(aCase) ? 'Lead case' : '',
        daysSinceLastStatusChange: daysElapsedSinceLastStatusChange,
        docketNumber: aCase.docketNumber,
        docketNumberWithSuffix: aCase.docketNumberWithSuffix,
        finalBriefDueDateFormatted,
        formattedCaseCount: aCase.formattedCaseCount || 1,
        formattedSubmittedCavStatusDate: statusDate,
        inConsolidatedGroup: !!isLeadCase(aCase),
        isLeadCase: isLeadCase(aCase),
        status: aCase.status,
        worksheet: aCase.caseWorksheet,
      };
    })
    .sort((a, b) => {
      return b.daysSinceLastStatusChange - a.daysSinceLastStatusChange;
    })
    .map(ws => {
      return {
        ...ws,
        daysSinceLastStatusChange: formatPositiveNumber(
          ws.daysSinceLastStatusChange,
        ),
      };
    });

  return {
    caseWorksheetsFormatted,
  };
};
