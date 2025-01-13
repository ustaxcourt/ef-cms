import { getJudgeForCurrentUserAction } from '@web-client/presenter/actions/getJudgeForCurrentUserAction';
import { state } from '@web-client/presenter/app.cerebral';

export const validateCaseWorksheetAction = async ({
  applicationContext,
  get,
  path,
}: ActionProps) => {
  const { docketNumber, finalBriefDueDate, primaryIssue, statusOfMatter } = get(
    state.form,
  );

  const { judgeUser } = await getJudgeForCurrentUserAction({
    applicationContext,
    get,
  } as ActionProps);

  const errors = applicationContext
    .getUseCases()
    .validateCaseWorksheetInteractor({
      caseWorksheet: {
        docketNumber,
        finalBriefDueDate,
        judgeUserId: judgeUser.userId,
        primaryIssue,
        statusOfMatter,
      },
    });

  if (!errors) {
    return path.success();
  } else {
    return path.error({
      alertError: {
        title: 'Errors were found. Please correct your form and resubmit.',
      },
      errors,
    });
  }
};
