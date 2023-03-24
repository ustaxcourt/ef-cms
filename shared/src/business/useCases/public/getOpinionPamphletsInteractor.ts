import { OPINION_PAMPHLET_EVENT_CODE } from '../../entities/EntityConstants';

/**
 * getOpinionPamphletsInteractor
 *
 * @param {object} applicationContext application context object
 * @returns {array} an array of opinion pamphlets (if any)
 */
export const getOpinionPamphletsInteractor = async (
  applicationContext: IApplicationContext,
) => {
  const { results } = await applicationContext
    .getPersistenceGateway()
    .advancedDocumentSearch({
      applicationContext,
      documentEventCodes: [OPINION_PAMPHLET_EVENT_CODE],
      isOpinionPamhplet: true,
    });

  return results;
};
