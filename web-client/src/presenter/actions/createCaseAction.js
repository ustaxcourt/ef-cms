import { omit } from 'lodash';
import { setupPercentDone } from './createCaseFromPaperAction';
import { state } from 'cerebral';
/**
 * invokes the filePetition useCase.
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get function used for getting petition
 * @returns {object} the next path based on if creation was successful or error
 */
export const createCaseAction = async ({
  applicationContext,
  store,
  get,
  path,
}) => {
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

  let caseDetail;

  try {
    caseDetail = await applicationContext.getUseCases().filePetition({
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

  for (let document of caseDetail.documents) {
    await applicationContext.getUseCases().virusScanPdf({
      applicationContext,
      documentId: document.documentId,
    });

    await applicationContext.getUseCases().validatePdf({
      applicationContext,
      documentId: document.documentId,
    });

    await applicationContext.getUseCases().sanitizePdf({
      applicationContext,
      documentId: document.documentId,
    });

    await applicationContext.getUseCases().createCoverSheet({
      applicationContext,
      caseId: caseDetail.caseId,
      documentId: document.documentId,
    });
  }

  return path.success({
    caseDetail,
  });
};
