import { state } from '@web-client/presenter/app.cerebral';

const addCoversheet = ({ applicationContext, docketEntryId, docketNumber }) => {
  return applicationContext
    .getUseCases()
    .addCoversheetInteractor(applicationContext, {
      docketEntryId,
      docketNumber,
    });
};

/**
 * upload document to s3.
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get function
 * @param {object} providers.path the next object in the path
 * @param {Function} providers.store the cerebral store function
 * @returns {object} the next path based on if validation was successful or error
 */
export const uploadExternalDocumentsAction = async ({
  applicationContext,
  get,
  path,
  props,
}: ActionProps) => {
  const { documentMetadata, files, fileUploadProgressMap } = props;
  const { docketNumber } = get(state.caseDetail);
  const form = get(state.form);

  try {
    const { caseDetail, docketEntryIdsAdded } = await applicationContext
      .getUseCases()
      .uploadExternalDocumentsInteractor(applicationContext, {
        documentFiles: files,
        documentMetadata,
        progressTrackerCbs: fileUploadProgressMap,
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
