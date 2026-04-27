import { FileUploadProgressType } from '@shared/business/entities/EntityConstants';
import { state } from '@web-client/presenter/app.cerebral';

export const uploadExternalDocumentsAction = async ({
  applicationContext,
  get,
  path,
  props,
}: ActionProps<{
  fileUploadProgressMap: Record<string, FileUploadProgressType>;
  files: File;
  documentMetadata: any;
}>) => {
  const { documentMetadata, files, fileUploadProgressMap } = props;
  const { docketNumber } = get(state.caseDetail);
  const user = get(state.user);

  try {
    await applicationContext
      .getUseCases()
      .uploadExternalDocumentsInteractor(
        applicationContext,
        {
          documentFiles: files,
          documentMetadata,
          fileUploadProgressMap,
        },
        user,
      );

    return path.success({
      docketNumber,
      documentsFiled: documentMetadata,
      fileAcrossConsolidatedGroup: documentMetadata.fileAcrossConsolidatedGroup,
    });
  } catch (err) {
    return path.error();
  }
};
