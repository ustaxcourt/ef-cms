import { state } from 'cerebral';

/**
 * upload document to s3.
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.path the cerebral path to take depending on if the file was uploaded successfully or not
 * @param {object} providers.get the cerebral get method used for getting state
 * @returns {object} the next path based on if the file was successfully uploaded or not
 */
export const appendFormAndOverwriteOrderFileAction = async ({
  applicationContext,
  get,
}) => {
  const { primaryDocumentFile } = get(state.form);
  // const documentToEdit = get(state.documentToEdit);
  // let finalDocument = primaryDocumentFile;

  // Identify an endpoint to call if eventCode === OAP
  // We will probably need a new endpoint so that we can edit the draft OAP

  //create an endpoint to combine the 2 pdfs
  const thing1 = await applicationContext
    .getUseCases()
    .appendAmendedPetitionFormInteractor(applicationContext, {
      orderContent: primaryDocumentFile,
    });

  console.log(thing1, '----');

  // proxy (web client app context) -> lambda -> interactor (web api )
};
