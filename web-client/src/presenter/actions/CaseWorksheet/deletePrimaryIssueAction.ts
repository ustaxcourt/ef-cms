import { state } from '@web-client/presenter/app.cerebral';

export const deletePrimaryIssueAction = async ({
  applicationContext,
  get,
}: ActionProps) => {
  const { docketNumber } = get(state.modal);

  const updatedWorksheet = await applicationContext
    .getUseCases()
    .deletePrimaryIssueInteractor(applicationContext, {
      docketNumber: docketNumber!,
    });

  return { updatedWorksheet };
};
