import { state } from '@web-client/presenter/app.cerebral';

/**
 * upload the image to s3 and create the practitioner document.
 * @param {object} providers the providers object
 * @param {object} providers.router the riot.router object that is used for changing the route
 * @param {Function} providers.get the cerebral get function used for getting the path to navigate to in state.path
 * @returns {Promise} async action
 */
export const createPractitionerDocumentAction = async ({
  applicationContext,
  get,
}: ActionProps) => {
  const { practitionerDocumentFile, ...form } = get(state.form);
  const { barNumber } = get(state.practitionerDetail);

  const practitionerDocumentFileId = await applicationContext
    .getUseCases()
    .uploadOrderDocumentInteractor(applicationContext, {
      documentFile: practitionerDocumentFile,
    });

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
