import { DocumentSearch } from '../../../../../shared/src/business/entities/documents/DocumentSearch';
import {
  FORMATS,
  formatNow,
} from '../../../../../shared/src/business/utilities/DateHandler';
import {
  MAX_SEARCH_RESULTS,
  ORDER_EVENT_CODES,
} from '../../../../../shared/src/business/entities/EntityConstants';
import { PublicDocumentSearchResult } from '../../../../../shared/src/business/entities/documents/PublicDocumentSearchResult';
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
  applicationContext.logger.info('public order search', {
    ...omit(rawSearch, 'entityName'),
    timestamp,
    totalCount,
  });

  const slicedResults = results.slice(0, MAX_SEARCH_RESULTS);

  return PublicDocumentSearchResult.validateRawCollection(slicedResults, {
    applicationContext,
  });
};
