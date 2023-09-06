import { state } from '@web-client/presenter/app.cerebral';

export const updateFinalBriefDueDateAction = async ({
  applicationContext,
  get,
  props,
}: ActionProps<{ docketNumber: string; finalBriefDueDate: string }>) => {
  const { docketNumber, finalBriefDueDate } = props;

  const chambersJudgeUser = get(state.judgeUser);
  // const isChambersUser = role === USER_ROLES.chambers;
  // const judgeUserId =
  //   isChambersUser && chambersJudgeUser ? chambersJudgeUser.userId : userId;

  const updatedWorksheet = await applicationContext
    .getUseCases()
    .updateCaseWorksheetInteractor(applicationContext, {
      docketNumber,
      judgeUserId: chambersJudgeUser.userId,
      updatedProps: {
        finalBriefDueDate,
      },
    });

  return { updatedWorksheet };
};
