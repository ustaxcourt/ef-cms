import {
  MAX_SEARCH_RESULTS,
  ORDER_EVENT_CODES,
} from '../../entities/EntityConstants';
import { PublicDocumentSearchResult } from '../../entities/documents/PublicDocumentSearchResult';
import { DocumentSearch } from '../../entities/documents/DocumentSearch';
import { formatNow, FORMATS } from '../../utilities/DateHandler';
import { omit } from 'lodash';

/**
 * orderPublicSearchInteractor
 *
 * @param {object} applicationContext application context object
 * @param {object} providers the providers object
 * @param {string} providers.caseTitleOrPetitioner case title or petitioner to search for
 * @param {string} providers.docketNumber docket number
 * @param {string} providers.endDate ending date for date range
 * @param {string} providers.judge judge name to filter by
 * @param {string} providers.keyword keyword to search for
 * @param {string} providers.startDate start date for date range
 * @returns {object} the order search results
 */
export const orderPublicSearchInteractor = async (
  applicationContext: IApplicationContext,
  {
    caseTitleOrPetitioner,
    dateRange,
    docketNumber,
    endDate,
    judge,
    keyword,
    startDate,
  }: {
    caseTitleOrPetitioner: string;
    dateRange: string;
    docketNumber: string;
    endDate: string;
    judge: string;
    keyword: string;
    startDate: string;
  },
) => {
  const orderSearch = new DocumentSearch({
    caseTitleOrPetitioner,
    dateRange,
    docketNumber,
    endDate,
    judge,
    keyword,
    startDate,
  });

  const rawSearch = orderSearch.validate().toRawObject();

  const { results, totalCount } = await applicationContext
    .getPersistenceGateway()
    .advancedDocumentSearch({
      applicationContext,
      documentEventCodes: ORDER_EVENT_CODES,
      omitSealed: true,
      ...rawSearch,
    });

  const timestamp = formatNow(FORMATS.LOG_TIMESTAMP);
  await applicationContext.logger.info('public order search', {
    ...omit(rawSearch, 'entityName'),
    timestamp,
    totalCount,
  });

  const slicedResults = results.slice(0, MAX_SEARCH_RESULTS);

  return PublicDocumentSearchResult.validateRawCollection(slicedResults, {
    applicationContext,
  });
};
