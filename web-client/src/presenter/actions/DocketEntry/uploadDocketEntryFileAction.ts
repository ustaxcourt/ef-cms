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
  const docketEntryId = get(state.docketEntryId);
  const { fileUploadProgressMap } = props;
  try {
    const primaryDocumentFileId = await applicationContext
      .getUseCases()
      .uploadDocumentInteractor(applicationContext, {
        documentFile: fileUploadProgressMap.primary.file,
        key: docketEntryId,
        onUploadProgress: fileUploadProgressMap.primary.uploadProgress,
      });

    return path.success({
      docketEntryId: primaryDocumentFileId,
    });
  } catch (err) {
    return path.error();
  }
};
