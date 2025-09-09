import { DocumentSearch } from '@shared/business/entities/documents/DocumentSearch';
import { FORMATS, formatNow } from '@shared/business/utilities/DateHandler';
import { PublicDocumentSearchResult } from '@shared/business/entities/documents/PublicDocumentSearchResult';
import { MAX_SEARCH_RESULTS } from '@shared/business/entities/EntityConstants';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { omit } from 'lodash';

export const opinionPublicSearchInteractor = async (
  applicationContext: ServerApplicationContext,
  {
    caseTitleOrPetitioner,
    dateRange,
    docketNumber,
    endDate,
    judge,
    keyword,
    opinionTypes,
    startDate,
    from = 0,
    limit = 5000,
    cursor,
  }: {
    caseTitleOrPetitioner: string;
    dateRange: string;
    docketNumber: string;
    endDate: string;
    judge: string;
    keyword: string;
    opinionTypes: string[];
    startDate: string;
    from?: number;
    limit?: number;
    cursor?: any[];
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
    from,
  });

  const rawSearch = opinionSearch.validate().toRawObject();

  const detectionCeiling = Math.min(limit + 1, MAX_SEARCH_RESULTS + 1);
  const desired = Math.min(limit, MAX_SEARCH_RESULTS);
  const accumulated: any[] = [];
  let searchAfter: any[] | undefined = undefined;
  let nextCursor: any[] | undefined = undefined;
  let rawFetches = 0;
  const RAW_BATCH_SIZE = 1500;
  const MAX_FETCH_BATCHES = 15;

  while (
    accumulated.length < detectionCeiling &&
    rawFetches < MAX_FETCH_BATCHES
  ) {
    const { results: rawResults } = await applicationContext
      .getPersistenceGateway()
      .advancedDocumentSearch({
        applicationContext,
        documentEventCodes: opinionTypes,
        isOpinionSearch: true,
        ...rawSearch,
        overrideResultSize: RAW_BATCH_SIZE,
        searchAfter: cursor && rawFetches === 0 ? cursor : searchAfter,
      });
    rawFetches++;
    if (rawResults.length === 0) break;
    for (const r of rawResults) {
      if (accumulated.length >= detectionCeiling) break;
      accumulated.push(r);
    }
    const last = rawResults[rawResults.length - 1];
    if (last && last.sort) {
      searchAfter = last.sort;
      nextCursor = last.sort;
    } else {
      break;
    }
  }

  const timestamp = formatNow(FORMATS.LOG_TIMESTAMP);
  applicationContext.logger.info('public opinion search', {
    ...omit(rawSearch, 'entityName'),
    timestamp,
  });

  const validated = PublicDocumentSearchResult.validateRawCollection(
    accumulated,
  ).slice(0, desired);
  const moreResults = accumulated.length > desired;

  return {
    results: validated,
    moreResults,
    nextCursor: moreResults ? nextCursor : undefined,
  };
};
