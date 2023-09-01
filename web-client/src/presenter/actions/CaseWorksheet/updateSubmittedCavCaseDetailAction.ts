import { state } from '@web-client/presenter/app.cerebral';

export const updateSubmittedCavCaseDetailAction = async ({
  applicationContext,
  get,
  props,
  store,
}: ActionProps) => {
  const { docketNumber, finalBriefDueDate, statusOfMatter } = props;

  store.unset(state.judgeDashboardCaseWorksheetErrors[docketNumber]);

  // if (
  //   finalBriefDueDate !== '' &&
  //   !applicationContext.getUtilities().isValidDateString(finalBriefDueDate)
  // ) {
  //   store.set(state.judgeDashboardCaseWorksheetErrors[docketNumber], {
  //     finalBriefDueDate: 'Enter a valid due date.',
  //   });
  //   return;
  // }

  await applicationContext
    .getUseCases()
    .updateCaseWorksheetInfoInteractor(applicationContext, {
      docketNumber,
      finalBriefDueDate,
      statusOfMatter,
    });

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
