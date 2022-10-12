import { state } from 'cerebral';

/**
 * upload the image to s3 and create the practitioner document.
 *
 * @param {object} providers the providers object
 * @param {object} providers.router the riot.router object that is used for changing the route
 * @param {Function} providers.get the cerebral get function used for getting the path to navigate to in state.path
 * @returns {Promise} async action
 */
export const createPractitionerDocumentAction = async ({
  applicationContext,
  get,
}) => {
  const { practitionerDocumentFile, ...form } = get(state.form);
  const { barNumber } = get(state.practitionerDetail);

  // uploads to s3
  const practitionerDocumentFileId = await applicationContext
    .getUseCases()
    .uploadOrderDocumentInteractor(applicationContext, {
      documentFile: practitionerDocumentFile,
    });

  // create the document entity and store it in dynamo
  await applicationContext
    .getUseCases()
    .createPractitionerDocumentInteractor(applicationContext, {
      barNumber,
      documentMetadata: {
        fileName: practitionerDocumentFile.name,
        practitionerDocumentFileId,
        ...form,
      },
    });
};
