import { state } from '@web-client/presenter/app.cerebral';

export const updateSubmittedCavCaseDetailAction = ({
  applicationContext,
  get,
  props,
  store,
}: ActionProps) => {
  const { docketNumber, finalBriefDueDate, statusOfMatter } = props;

  store.unset(state.judgeDashboardCaseWorksheetErrors[docketNumber]);

  if (!applicationContext.getUtilities().isValidDateString(finalBriefDueDate)) {
    store.set(state.judgeDashboardCaseWorksheetErrors[docketNumber], {
      finalBriefDueDate: 'Enter a valid due date.',
    });
    return;
  }

  const index = get(
    state.judgeActivityReportData.submittedAndCavCasesByJudge,
  ).findIndex(theCase => theCase.docketNumber === docketNumber);

  if (statusOfMatter !== undefined) {
    store.set(
      state`judgeActivityReportData.submittedAndCavCasesByJudge.${index}.statusOfMatter`,
      statusOfMatter === null ? '' : statusOfMatter,
    );
  }
};
