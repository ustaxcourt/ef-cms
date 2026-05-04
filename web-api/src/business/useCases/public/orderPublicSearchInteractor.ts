import { omit } from 'lodash';
import {
  MAX_DOCUMENT_SEARCH_RESULTS,
  ORDER_EVENT_CODES,
} from '@shared/business/entities/EntityConstants';
import { DocumentSearch } from '@web-api/business/entities/documents/DocumentSearch';
import {
  PublicDocumentSearchResult,
  RawPublicDocumentSearchResult,
} from '@shared/business/entities/documents/PublicDocumentSearchResult';
import { FORMATS, formatNow } from '@shared/business/utilities/DateHandler';
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
    limit = MAX_DOCUMENT_SEARCH_RESULTS,
  }: {
    caseTitleOrPetitioner: string;
    dateRange: string;
    docketNumber: string;
    endDate: string;
    judge: string;
    keyword: string;
    startDate: string;
    limit?: number;
  },
): Promise<{
  results: RawPublicDocumentSearchResult[];
}> => {
  const orderSearch = new DocumentSearch({
    caseTitleOrPetitioner,
    dateRange,
    docketNumber,
    endDate,
    judge,
    keyword,
    startDate,
    from: 0,
  });

  const rawSearch = orderSearch.validate().toRawObject();

  const accessible: any[] = [];
  let searchAfter: any[] | undefined = undefined;
  const maxCeiling = Math.min(MAX_DOCUMENT_SEARCH_RESULTS, limit);

  while (accessible.length < limit) {
    const sizeNeeded = limit - accessible.length;
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
      if (accessible.length >= limit) break;
      accessible.push(r);
    }

    const lastRaw = rawBatch[rawBatch.length - 1];

    if (lastRaw && lastRaw.sort) {
      searchAfter = lastRaw.sort;
    } else {
      break;
    }
    if (accessible.length >= maxCeiling) break;
  }

  const timestamp = formatNow(FORMATS.LOG_TIMESTAMP);

  applicationContext.logger.info('public order search', {
    ...omit(rawSearch, 'entityName'),
    timestamp,
  });

  const validated =
    PublicDocumentSearchResult.validateRawCollection(accessible);

  return {
    results: validated,
  };
};
