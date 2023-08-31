import { state } from '@web-client/presenter/app.cerebral';

type ComputedSubmittedAndCavCase = RawCase & {
  consolidatedIconTooltipText: string;
  isLeadCase: boolean;
  inConsolidatedGroup: boolean;
  formattedCaseCount: number;
  daysElapsedSinceLastStatusChange: number;
  formattedSubmittedCavStatusChangedDate: string;
};
interface ISubmittedAndCavCasesForJudgeHelper {
  filteredSubmittedAndCavCasesByJudge: ComputedSubmittedAndCavCase[];
}

export const submittedAndCavCasesForJudgeHelper = (
  get: any,
  applicationContext: IApplicationContext,
): ISubmittedAndCavCasesForJudgeHelper => {
  const { consolidatedCasesGroupCountMap, submittedAndCavCasesByJudge = [] } =
    get(state.judgeActivityReport.judgeActivityReportData);

  const currentDateInIsoFormat: string = applicationContext
    .getUtilities()
    .formatDateString(
      applicationContext.getUtilities().prepareDateFromString(),
      applicationContext.getConstants().DATE_FORMATS.ISO,
    );

  const getSubmittedOrCAVDate = (
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

  const filteredSubmittedAndCavCasesByJudge =
    submittedAndCavCasesByJudge.filter(
      unfilteredCase => unfilteredCase.caseStatusHistory.length > 0,
    );

  filteredSubmittedAndCavCasesByJudge.forEach(individualCase => {
    // TODO: figure out what changed - used to call .get on the object
    individualCase.formattedCaseCount =
      consolidatedCasesGroupCountMap[individualCase.docketNumber] || 1;
    if (individualCase.leadDocketNumber === individualCase.docketNumber) {
      individualCase.consolidatedIconTooltipText = 'Lead case';
      individualCase.isLeadCase = true;
      individualCase.inConsolidatedGroup = true;
    }

    individualCase.formattedSubmittedCavStatusChangedDate =
      getSubmittedOrCAVDate(individualCase.caseStatusHistory);

    const newestCaseStatusChangeIndex =
      individualCase.caseStatusHistory.length - 1;

    const dateOfLastCaseStatusChange =
      individualCase.caseStatusHistory[newestCaseStatusChangeIndex].date;

    individualCase.daysElapsedSinceLastStatusChange = applicationContext
      .getUtilities()
      .calculateDifferenceInDays(
        currentDateInIsoFormat,
        dateOfLastCaseStatusChange,
      );
  });

  filteredSubmittedAndCavCasesByJudge.sort((a, b) => {
    return (
      b.daysElapsedSinceLastStatusChange - a.daysElapsedSinceLastStatusChange
    );
  });

  return {
    filteredSubmittedAndCavCasesByJudge,
  };
};
