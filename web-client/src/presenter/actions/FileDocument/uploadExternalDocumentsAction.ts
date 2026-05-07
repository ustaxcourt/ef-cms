import { FileUploadProgressType } from '@shared/business/entities/EntityConstants';
import { pollForCoversheetComplete } from '@web-client/presenter/utilities/pollForCoversheetComplete';
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
    const { docketEntryIdsAdded } = await applicationContext
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

    await pollForCoversheetComplete({
      applicationContext,
      docketEntryIds: docketEntryIdsAdded,
      docketNumber,
    });

    return path.success({
      docketNumber,
      documentsFiled: documentMetadata,
      fileAcrossConsolidatedGroup: documentMetadata.fileAcrossConsolidatedGroup,
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('uploadExternalDocumentsAction failed', err);
    return path.error();
  }
};
