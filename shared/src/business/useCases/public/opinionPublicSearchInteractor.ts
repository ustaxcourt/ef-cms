import { PublicDocumentSearchResult } from '../../entities/documents/PublicDocumentSearchResult';
import { DocumentSearch } from '../../entities/documents/DocumentSearch';
import { formatNow, FORMATS } from '../../utilities/DateHandler';
import { MAX_SEARCH_RESULTS } from '../../entities/EntityConstants';
import { omit } from 'lodash';

/**
 * opinionPublicSearchInteractor
 *
 * @param {object} applicationContext application context object
 * @param {object} providers the providers object
 * @param {string} providers.caseTitleOrPetitioner case title or petitioner to search for
 * @param {string} providers.docketNumber docket number
 * @param {string} providers.endDate ending date for date range
 * @param {string} providers.judge judge name to filter by
 * @param {string} providers.keyword keyword to search for
 * @param {string} providers.opinionTypes opinion types to filter by
 * @param {string} providers.startDate start date for date range
 * @returns {object} the opinion search results
 */
export const opinionPublicSearchInteractor = async (
  applicationContext: IApplicationContext,
  {
    caseTitleOrPetitioner,
    dateRange,
    docketNumber,
    endDate,
    judge,
    keyword,
    opinionTypes,
    startDate,
  }: {
    caseTitleOrPetitioner: string;
    dateRange: string;
    docketNumber: string;
    endDate: string;
    judge: string;
    keyword: string;
    opinionTypes: string;
    startDate: string;
  },
) => {
  const opinionSearch = new DocumentSearch({
    caseTitleOrPetitioner,
    dateRange,
    docketNumber,
    endDate,
    judge,
    keyword,
    startDate,
  });

  const rawSearch = opinionSearch.validate().toRawObject();

  const { results, totalCount } = await applicationContext
    .getPersistenceGateway()
    .advancedDocumentSearch({
      applicationContext,
      documentEventCodes: opinionTypes,
      isOpinionSearch: true,
      ...rawSearch,
    });

  const timestamp = formatNow(FORMATS.LOG_TIMESTAMP);
  await applicationContext.logger.info('public opinion search', {
    ...omit(rawSearch, 'entityName'),
    timestamp,
    totalCount,
  });

  const filteredResults = results.slice(0, MAX_SEARCH_RESULTS);

  return PublicDocumentSearchResult.validateRawCollection(filteredResults, {
    applicationContext,
  });
};
