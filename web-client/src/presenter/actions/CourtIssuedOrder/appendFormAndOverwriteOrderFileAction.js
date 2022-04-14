import { state } from 'cerebral';

/**
 * append form and overwrite order file
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.get the cerebral get method used for getting state
 */
export const appendFormAndOverwriteOrderFileAction = async ({
  applicationContext,
  get,
}) => {
  const { docketEntryId } = get(state.documentToEdit);

  await applicationContext
    .getUseCases()
    .appendAmendedPetitionFormInteractor(applicationContext, {
      docketEntryId,
    });
};
