import { FileUploadProgressType } from '@shared/business/entities/EntityConstants';
import { state } from '@web-client/presenter/app.cerebral';

export const uploadDocketEntryFileAction = async ({
  applicationContext,
  get,
  path,
  props,
}: ActionProps<{
  fileUploadProgressMap: Record<string, FileUploadProgressType>;
}>) => {
  const user = get(state.user);
  const documentStorageId = get(state.form.documentStorageId) || undefined;
  const { fileUploadProgressMap } = props;
  try {
    const primaryDocumentFileId = await applicationContext
      .getUseCases()
      .uploadDocumentInteractor(
        applicationContext,
        {
          documentFile: fileUploadProgressMap.primary.file,
          key: documentStorageId,
          onUploadProgress: fileUploadProgressMap.primary.uploadProgress,
        },
        user,
      );
    return path.success({
      documentStorageId: primaryDocumentFileId,
    });
  } catch (err) {
    return path.error();
  }
};
