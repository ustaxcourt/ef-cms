import { state } from '@web-client/presenter/app.cerebral';

export const updateCaseDeadlineAction = async ({
  applicationContext,
  get,
  path,
}: ActionProps) => {
  const { associatedJudge, associatedJudgeId, docketNumber, leadDocketNumber } =
    get(state.caseDetail);

  const caseDeadline = {
    ...get(state.form),
    associatedJudge,
    associatedJudgeId,
    docketNumber,
    leadDocketNumber,
  };

  const updateCaseDeadlineResult = await applicationContext
    .getUseCases()
    .updateCaseDeadlineInteractor(applicationContext, {
      caseDeadline,
    });

  return path.success({
    alertSuccess: {
      message: 'Deadline updated.',
    },
    caseDeadline: updateCaseDeadlineResult,
  });
};
