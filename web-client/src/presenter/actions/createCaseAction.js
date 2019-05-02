import { omit } from 'lodash';
import { setupPercentDone } from './createCaseFromPaperAction';
import { state } from 'cerebral';
/**
 * invokes the filePetition useCase.
 *
 * @param {Object} providers the providers object
 * @param {Object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get function used for getting petition
 */
export const createCaseAction = async ({ applicationContext, store, get }) => {
  const { petitionFile, ownershipDisclosureFile, stinFile } = get(
    state.petition,
  );

  const form = omit(
    {
      ...get(state.form),
    },
    ['year', 'month', 'day', 'trialCities', 'signature'],
  );

  form.contactPrimary.email = get(state.user.email);

  const progressFunctions = setupPercentDone(
    {
      ownership: ownershipDisclosureFile,
      petition: petitionFile,
      stin: stinFile,
    },
    store,
  );

  const caseDetail = await applicationContext.getUseCases().filePetition({
    applicationContext,
    ownershipDisclosureFile,
    ownershipDisclosureUploadProgress: progressFunctions.ownership,
    petitionFile,
    petitionMetadata: form,
    petitionUploadProgress: progressFunctions.petition,
    stinFile,
    stinUploadProgress: progressFunctions.stin,
  });

  for (let document of caseDetail.documents) {
    await applicationContext.getUseCases().createCoverSheet({
      applicationContext,
      caseId: caseDetail.caseId,
      documentId: document.documentId,
    });
  }

  return {
    caseDetail,
  };
};
