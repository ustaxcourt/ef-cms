import { DocumentSearch } from '@shared/business/entities/documents/DocumentSearch';
import { FORMATS, formatNow } from '@shared/business/utilities/DateHandler';
import { PublicDocumentSearchResult } from '@shared/business/entities/documents/PublicDocumentSearchResult';
import {
  OPENSEARCH_DOCUMENT_SEARCH_MAX_BATCHES_PER_QUERY,
  MAX_SEARCH_RESULTS,
  OPENSEARCH_DOCUMENT_SEARCH_SINGLE_BATCH_SIZE,
} from '@shared/business/entities/EntityConstants';
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
  let opensearchDocumentSearchBatchCount = 0;

  while (
    accumulated.length < detectionCeiling &&
    opensearchDocumentSearchBatchCount <
      OPENSEARCH_DOCUMENT_SEARCH_MAX_BATCHES_PER_QUERY
  ) {
    const { results: rawResults } = await applicationContext
      .getPersistenceGateway()
      .advancedDocumentSearch({
        applicationContext,
        documentEventCodes: opinionTypes,
        isOpinionSearch: true,
        ...rawSearch,
        overrideResultSize: OPENSEARCH_DOCUMENT_SEARCH_SINGLE_BATCH_SIZE,
        searchAfter:
          cursor && opensearchDocumentSearchBatchCount === 0
            ? cursor
            : searchAfter,
      });
    opensearchDocumentSearchBatchCount++;
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

  const overFetched = accumulated.length > desired;
  if (overFetched) {
    if (accumulated[desired - 1]?.sort) {
      nextCursor = accumulated[desired - 1].sort;
    }
    accumulated.length = desired;
  }
  const validated =
    PublicDocumentSearchResult.validateRawCollection(accumulated);
  return {
    results: validated,
    moreResults: overFetched,
    nextCursor: overFetched ? nextCursor : undefined,
  };
};
