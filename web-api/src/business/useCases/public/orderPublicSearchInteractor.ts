import { DocumentSearch } from '@shared/business/entities/documents/DocumentSearch';
import { FORMATS, formatNow } from '@shared/business/utilities/DateHandler';
import { ORDER_EVENT_CODES } from '@shared/business/entities/EntityConstants';
import { MAX_SEARCH_RESULTS } from '@shared/business/entities/EntityConstants';
import { PublicDocumentSearchResult } from '@shared/business/entities/documents/PublicDocumentSearchResult';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { omit } from 'lodash';

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

  const { results } = await applicationContext
    .getPersistenceGateway()
    .advancedDocumentSearch({
      applicationContext,
      documentEventCodes: ORDER_EVENT_CODES,
      omitSealed: true,
      ...rawSearch,
      from,
      overrideResultSize: limit,
    });

  const timestamp = formatNow(FORMATS.LOG_TIMESTAMP);

  applicationContext.logger.info('public order search', {
    ...omit(rawSearch, 'entityName'),
    timestamp,
  });

  return {
    results: PublicDocumentSearchResult.validateRawCollection(results)
      .map(r => omit(r, 'entityName'))
      .slice(0, MAX_SEARCH_RESULTS),
  };
};
