import { state } from '@web-client/presenter/app.cerebral';

export const updatePrimaryIssueAction = async ({
  applicationContext,
  get,
}: ActionProps) => {
  const { docketNumber, primaryIssue } = get(state.modal);

  const updatedWorksheet = await applicationContext
    .getUseCases()
    .updateCaseWorksheetInteractor(applicationContext, {
      docketNumber: docketNumber!,
      updatedProps: {
        primaryIssue,
      },
    });

  return { updatedWorksheet };
};
