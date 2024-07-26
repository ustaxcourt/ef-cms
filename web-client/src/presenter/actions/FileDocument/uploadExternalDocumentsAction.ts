import { FileUploadProgressType } from '@shared/business/entities/EntityConstants';
import { state } from '@web-client/presenter/app.cerebral';

const addCoversheet = ({ applicationContext, docketEntryId, docketNumber }) => {
  return applicationContext
    .getUseCases()
    .addCoversheetInteractor(applicationContext, {
      docketEntryId,
      docketNumber,
    });
};

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
    const { caseDetail, docketEntryIdsAdded } = await applicationContext
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

    for (let docketEntryId of docketEntryIdsAdded) {
      await addCoversheet({
        applicationContext,
        docketEntryId,
        docketNumber,
      });
    }

    return path.success({
      caseDetail,
      docketNumber,
      documentsFiled: documentMetadata,
      fileAcrossConsolidatedGroup: documentMetadata.fileAcrossConsolidatedGroup,
    });
  } catch (err) {
    return path.error();
  }
};
