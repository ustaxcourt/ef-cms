import { FileUploadProgressMapType } from '@shared/business/entities/EntityConstants';
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
  fileUploadProgressMap: FileUploadProgressMapType;
  files: File;
  documentMetadata: any;
}>) => {
  const { documentMetadata, files, fileUploadProgressMap } = props;
  const { docketNumber } = get(state.caseDetail);
  const form = get(state.form);

  try {
    const { caseDetail, docketEntryIdsAdded } = await applicationContext
      .getUseCases()
      .uploadExternalDocumentsInteractor(applicationContext, {
        documentFiles: files,
        documentMetadata,
        fileUploadProgressMap,
      });

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
      fileAcrossConsolidatedGroup: form.fileAcrossConsolidatedGroup,
    });
  } catch (err) {
    return path.error();
  }
};
