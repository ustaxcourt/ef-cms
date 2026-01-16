import { state } from '@web-client/presenter/app.cerebral';

export const overwriteOrderFileAction = async ({
  applicationContext,
  get,
  path,
}: ActionProps) => {
  const { primaryDocumentFile } = get(state.form);
  const documentToEdit = get(state.documentToEdit);
  const user = get(state.user);

  try {
    const primaryDocumentFileId = await applicationContext
      .getUseCases()
      .uploadOrderDocumentInteractor(
        applicationContext,
        {
          documentFile: primaryDocumentFile,
          fileIdToOverwrite: documentToEdit.documentStorageId,
        },
        user,
      );

    return path.success({
      primaryDocumentFileId,
    });
  } catch (err) {
    return path.error();
  }
};
