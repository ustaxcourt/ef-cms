import { state } from '@web-client/presenter/app.cerebral';

export const appendFormAndOverwriteOrderFileAction = async ({
  applicationContext,
  get,
}: ActionProps) => {
  const { documentStorageId } = get(state.documentToEdit);

  await applicationContext
    .getUseCases()
    .appendAmendedPetitionFormInteractor(applicationContext, {
      documentStorageId,
    });
};
