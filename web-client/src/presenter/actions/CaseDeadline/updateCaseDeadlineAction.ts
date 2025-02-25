import { state } from '@web-client/presenter/app.cerebral';

export const updateCaseDeadlineAction = async ({
  applicationContext,
  get,
  path,
  store,
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

  const existingCaseDeadlines = get(state.caseDeadlines);

  const updatedCaseDeadlines = existingCaseDeadlines.map(deadline =>
    deadline.caseDeadlineId === updateCaseDeadlineResult.caseDeadlineId
      ? updateCaseDeadlineResult
      : deadline,
  );

  store.set(state.caseDeadlines, updatedCaseDeadlines);

  return path.success({
    alertSuccess: {
      message: 'Deadline updated.',
    },
    caseDeadline: updateCaseDeadlineResult,
  });
};
