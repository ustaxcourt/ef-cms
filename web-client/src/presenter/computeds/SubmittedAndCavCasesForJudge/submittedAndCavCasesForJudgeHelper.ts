import { state } from '@web-client/presenter/app.cerebral';

type ComputedSubmittedAndCavCase = RawCase & {
  consolidatedIconTooltipText: string;
  isLeadCase: boolean;
  inConsolidatedGroup: boolean;
  formattedCaseCount: number;
  daysElapsedSinceLastStatusChange: number;
};
interface ISubmittedAndCavCasesForJudgeHelper {
  filteredSubmittedAndCavCasesByJudge: ComputedSubmittedAndCavCase[];
}

export const submittedAndCavCasesForJudgeHelper = (
  get: any,
  applicationContext: IApplicationContext,
): ISubmittedAndCavCasesForJudgeHelper => {
  const { consolidatedCasesGroupCountMap, submittedAndCavCasesByJudge = [] } =
    get(state.judgeActivityReportData);

  const currentDateInIsoFormat: string = applicationContext
    .getUtilities()
    .formatDateString(
      applicationContext.getUtilities().prepareDateFromString(),
      applicationContext.getConstants().DATE_FORMATS.ISO,
    );

  const filteredSubmittedAndCavCasesByJudge =
    submittedAndCavCasesByJudge.filter(
      unfilteredCase => unfilteredCase.caseStatusHistory.length > 0,
    );

  filteredSubmittedAndCavCasesByJudge.forEach(individualCase => {
    individualCase.formattedCaseCount =
      consolidatedCasesGroupCountMap.get(individualCase.docketNumber) || 1;
    if (individualCase.leadDocketNumber === individualCase.docketNumber) {
      individualCase.consolidatedIconTooltipText = 'Lead case';
      individualCase.isLeadCase = true;
      individualCase.inConsolidatedGroup = true;
    }

    individualCase.caseStatusHistory
      .sort((a, b) => a.date - b.date)
      .map(
        csh =>
          (csh.formattedDate = applicationContext
            .getUtilities()
            .formatDateString(
              csh.date,
              applicationContext.getConstants().DATE_FORMATS.MMDDYY,
            )),
      );

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
