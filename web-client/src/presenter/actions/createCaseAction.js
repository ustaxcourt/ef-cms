import { omit } from 'lodash';
import { setupPercentDone } from './createCaseFromPaperAction';
import { state } from 'cerebral';
/**
 * invokes the filePetition useCase.
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get function used for getting petition
 * @param {object} providers.path the next object in the path
 * @param {object} providers.store the cerebral store object
 * @returns {object} the next path based on if creation was successful or error
 */
export const createCaseAction = async ({
  applicationContext,
  get,
  path,
  store,
}) => {
  const { ownershipDisclosureFile, petitionFile, stinFile } = get(state.form);

  const form = omit(
    {
      ...get(state.form),
    },
    'trialCities',
  );

  const user = applicationContext.getCurrentUser();
  form.contactPrimary.email = user.email;

  const progressFunctions = setupPercentDone(
    {
      ownership: ownershipDisclosureFile,
      petition: petitionFile,
      stin: stinFile,
    },
    store,
  );

  let caseDetail;

  try {
    caseDetail = await applicationContext.getUseCases().filePetitionInteractor({
      applicationContext,
      ownershipDisclosureFile,
      ownershipDisclosureUploadProgress: progressFunctions.ownership,
      petitionFile,
      petitionMetadata: form,
      petitionUploadProgress: progressFunctions.petition,
      stinFile,
      stinUploadProgress: progressFunctions.stin,
    });
  } catch (err) {
    return path.error();
  }

  const addCoversheet = document => {
    return applicationContext.getUseCases().addCoversheetInteractor({
      applicationContext,
      docketNumber: caseDetail.docketNumber,
      documentId: document.documentId,
    });
  };
  await Promise.all(caseDetail.documents.map(addCoversheet));

  return path.success({
    caseDetail,
  });
};
