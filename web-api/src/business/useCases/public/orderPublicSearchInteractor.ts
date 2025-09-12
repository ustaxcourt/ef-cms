import { omit } from 'lodash';
import {
  MAX_SEARCH_RESULTS,
  ORDER_EVENT_CODES,
} from '@shared/business/entities/EntityConstants';
import { DocumentSearch } from '@shared/business/entities/documents/DocumentSearch';
import { PublicDocumentSearchResult } from '@shared/business/entities/documents/PublicDocumentSearchResult';
import { FORMATS, formatNow } from '@shared/business/utilities/DateHandler';
import { openSearchBatchState } from '@shared/business/utilities/getOpenSearchBatchState';
import { ServerApplicationContext } from '@web-api/applicationContext';

export const orderPublicSearchInteractor = async (
  applicationContext: ServerApplicationContext,
  {
    caseTitleOrPetitioner,
    dateRange,
    docketNumber,
    endDate,
    judge,
    keyword,
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
    startDate: string;
    from?: number;
    limit?: number;
    cursor?: any[];
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
    from,
  });

  const rawSearch = orderSearch.validate().toRawObject();

  const { detectionCeiling, desired, accumulated } = openSearchBatchState(
    limit,
    MAX_SEARCH_RESULTS,
  );
  let nextCursor: any[] | undefined = undefined;
  let searchAfter: any[] | undefined = cursor;
  let lastRawOfBatch: any | undefined;

  while (accumulated.length < detectionCeiling) {
    const sizeNeeded = detectionCeiling - accumulated.length;
    const { results: rawBatch } = await applicationContext
      .getPersistenceGateway()
      .advancedDocumentSearch({
        applicationContext,
        documentEventCodes: ORDER_EVENT_CODES,
        omitSealed: true,
        ...rawSearch,
        overrideResultSize: sizeNeeded,
        searchAfter,
      });
    if (rawBatch.length === 0) break;
    for (const r of rawBatch) {
      if (accumulated.length >= detectionCeiling) break;
      accumulated.push(r);
    }
    lastRawOfBatch = rawBatch[rawBatch.length - 1];
    if (lastRawOfBatch && lastRawOfBatch.sort) {
      searchAfter = lastRawOfBatch.sort;
    } else {
      break;
    }
  }

  const moreResults = accumulated.length > desired;
  if (moreResults) {
    if (accumulated[desired - 1]?.sort) {
      nextCursor = accumulated[desired - 1].sort;
    }
  }

  const timestamp = formatNow(FORMATS.LOG_TIMESTAMP);
  applicationContext.logger.info('public order search', {
    ...omit(rawSearch, 'entityName'),
    timestamp,
  });

  const resultsPage = accumulated.slice(0, desired);

  const validated =
    PublicDocumentSearchResult.validateRawCollection(resultsPage);

  return {
    results: validated,
    moreResults,
    nextCursor: moreResults ? nextCursor : undefined,
  };
};
