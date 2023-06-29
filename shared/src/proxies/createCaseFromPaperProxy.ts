import { post } from './requests';

/**
 * createCaseProxy
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.corporateDisclosureFileId the id of the corporate disclosure file
 * @param {string} providers.petitionFileId the id of the petition file
 * @param {string} providers.petitionMetadata the petition metadata
 * @param {string} providers.requestForPlaceOfTrialFileId the id of the request for place of trial file
 * @param {string} providers.stinFileId the id of the stin file
 * @returns {Promise<*>} the promise of the api call
 */
export const createCaseFromPaperInteractor = (
  applicationContext,
  {
    applicationForWaiverOfFilingFeeFileId,
    corporateDisclosureFileId,
    petitionFileId,
    petitionMetadata,
    requestForPlaceOfTrialFileId,
    stinFileId,
  },
) => {
  return post({
    applicationContext,
    body: {
      applicationForWaiverOfFilingFeeFileId,
      corporateDisclosureFileId,
      petitionFileId,
      petitionMetadata,
      requestForPlaceOfTrialFileId,
      stinFileId,
    },
    endpoint: '/cases/paper',
  });
};
