import {
  CaseWorksheet,
  RawCaseWorksheet,
} from '@shared/business/entities/caseWorksheet/CaseWorksheet';
import { getJudgeForCurrentUserAction } from '@web-client/presenter/actions/getJudgeForCurrentUserAction';
import { state } from '@web-client/presenter/app.cerebral';

export const updateCaseWorksheetAction = async ({
  applicationContext,
  get,
}: ActionProps): Promise<{ updatedWorksheet: RawCaseWorksheet }> => {
  const { docketNumber, finalBriefDueDate, primaryIssue, statusOfMatter } = get(
    state.form,
  );

  const { judgeUser } = await getJudgeForCurrentUserAction({
    applicationContext,
    get,
  } as ActionProps);

  const updatedWorksheet = await applicationContext
    .getUseCases()
    .updateCaseWorksheetInteractor(applicationContext, {
      worksheet: new CaseWorksheet({
        docketNumber,
        finalBriefDueDate,
        judgeUserId: judgeUser.userId,
        primaryIssue,
        statusOfMatter,
      }).toRawObject(),
    });

  return { updatedWorksheet };
};
