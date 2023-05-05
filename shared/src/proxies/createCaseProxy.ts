import { post } from './requests';

/**
 * createCaseInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.corporateDisclosureFileId the id of the corporate disclosure file
 * @param {string} providers.petitionFileId the id of the petition file
 * @param {object} providers.petitionMetadata the petition metadata
 * @param {string} providers.stinFileId the id of the stin file
 * @returns {Promise<*>} the promise of the api call
 */
export const createCaseInteractor = (
  applicationContext,
  { corporateDisclosureFileId, petitionFileId, petitionMetadata, stinFileId },
) => {
  return post({
    applicationContext,
    body: {
      corporateDisclosureFileId,
      petitionFileId,
      petitionMetadata,
      stinFileId,
    },
    endpoint: '/cases',
  });
};
