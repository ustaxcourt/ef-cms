import { state } from '@web-client/presenter/app.cerebral';

/**
 * upload the image to s3 if it exists and update the practitioner document.
 * @param {object} providers the providers object
 * @param {object} providers.router the riot.router object that is used for changing the route
 * @param {Function} providers.get the cerebral get function used for getting the path to navigate to in state.path
 * @returns {Promise} async action
 */
export const editPractitionerDocumentAction = async ({
  applicationContext,
  get,
}: ActionProps) => {
  let { practitionerDocumentFile, practitionerDocumentFileId, ...form } = get(
    state.form,
  );
  const { barNumber } = get(state.practitionerDetail);

  let fileName;
  let uploadDate;

  if (practitionerDocumentFile) {
    await applicationContext
      .getUseCases()
      .uploadOrderDocumentInteractor(applicationContext, {
        documentFile: practitionerDocumentFile,
        fileIdToOverwrite: practitionerDocumentFileId,
      });

    fileName = practitionerDocumentFile.name;
    uploadDate = applicationContext.getUtilities().createISODateString();
  } else {
    ({ fileName, uploadDate } = form);
  }

  await applicationContext
    .getUseCases()
    .editPractitionerDocumentInteractor(applicationContext, {
      barNumber,
      documentMetadata: {
        ...form,
        fileName,
        practitionerDocumentFileId,
        uploadDate,
      },
    });
};
