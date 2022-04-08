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
  // use docketentry id to retrieve file from s3
  // then call new endpoint to append petition form to the retrieved file from s3
  const { docketEntryId } = get(state.documentToEdit);

  const thing1 = await applicationContext
    .getUseCases()
    .appendAmendedPetitionFormInteractor(applicationContext, {
      docketEntryId,
    });
};
