import { state } from '@web-client/presenter/app.cerebral';

export const deletePrimaryIssueAction = async ({
  applicationContext,
  get,
}: ActionProps) => {
  console.log('hey im going to delete');
  const { docketNumber } = get(state.modal);

  const updatedWorksheet = await applicationContext
    .getUseCases()
    .deletePrimaryIssueInteractor(applicationContext, {
      docketNumber: docketNumber!,
    });
  console.log('updatedWorksheet', updatedWorksheet);
  return { updatedWorksheet: { ...updatedWorksheet } };
};
