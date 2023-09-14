import { state } from '@web-client/presenter/app.cerebral';

export const updateSubmittedCavCaseDetailAction = async ({
  applicationContext,
  get,
  props,
  store,
}: ActionProps) => {
  const { docketNumber, finalBriefDueDate, statusOfMatter } = props;

  store.unset(state.judgeDashboardCaseWorksheetErrors[docketNumber]);

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
