import { state } from '@web-client/presenter/app.cerebral';

export const getJudgesCaseNoteForCaseAction = async ({
  applicationContext,
  get,
}: ActionProps) => {
  const docketNumber = get(state.caseDetail.docketNumber);

  let userNote;

  try {
    userNote = await applicationContext
      .getUseCases()
      .getUserCaseNoteInteractor(applicationContext, {
        docketNumber,
      });
  } catch (err) {
    userNote = {};
  }

  return { userNote };
};
