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
  // const docketEntryId = get(state.docketEntryId);
  // console.log({ docketEntryId });
  const user = get(state.user);
  const { fileUploadProgressMap } = props;
  try {
    const primaryDocumentFileId = await applicationContext
      .getUseCases()
      .uploadDocumentInteractor(
        applicationContext,
        {
          documentFile: fileUploadProgressMap.primary.file,
          key: undefined,
          onUploadProgress: fileUploadProgressMap.primary.uploadProgress,
        },
        user,
      );

    console.log({ primaryDocumentFileId });
    return path.success({
      documentStorageId: primaryDocumentFileId,
    });
  } catch (err) {
    return path.error();
  }
};
