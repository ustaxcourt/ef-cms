import {
  DOCUMENT_SEARCH_SORT,
  OPINION_PAMPHLET_EVENT_CODE,
} from '../../entities/EntityConstants';
import { PublicDocumentSearchResult } from '../../entities/documents/PublicDocumentSearchResult';

/**
 * getOpinionPamphletsInteractor
 *
 * @param {object} applicationContext application context object
 * @returns {array} an array of opinion pamphlets
 */
export const getOpinionPamphletsInteractor = async (
  applicationContext: IApplicationContext,
) => {
  const { results } = await applicationContext
    .getPersistenceGateway()
    .advancedDocumentSearch({
      applicationContext,
      documentEventCodes: [OPINION_PAMPHLET_EVENT_CODE],
      requireServedDate: false,
      sortField: DOCUMENT_SEARCH_SORT.FILING_DATE_DESC,
    });

  return PublicDocumentSearchResult.validateRawCollection(results, {
    applicationContext,
  });
};
