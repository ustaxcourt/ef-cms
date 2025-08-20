import { DocumentSearch } from '../../../../../shared/src/business/entities/documents/DocumentSearch';
import {
  FORMATS,
  formatNow,
} from '../../../../../shared/src/business/utilities/DateHandler';
import { MAX_SEARCH_RESULTS } from '../../../../../shared/src/business/entities/EntityConstants';
import { PublicDocumentSearchResult } from '../../../../../shared/src/business/entities/documents/PublicDocumentSearchResult';
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
  }: {
    caseTitleOrPetitioner: string;
    dateRange: string;
    docketNumber: string;
    endDate: string;
    judge: string;
    keyword: string;
    opinionTypes: string[];
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

  // Fetch results in batches to avoid server errors and safely aggregate up to 10,000
  const BATCH_SIZE = 1000;
  let allResults = [];
  let totalCount = 0;
  let from = 0;

  do {
    const { results, totalCount: batchTotal } = await applicationContext
      .getPersistenceGateway()
      .advancedDocumentSearch({
        applicationContext,
        documentEventCodes: opinionTypes,
        isOpinionSearch: true,
        ...rawSearch,
        from,
        overrideResultSize: BATCH_SIZE,
      });

    if (from === 0) totalCount = batchTotal;
    allResults = allResults.concat(results);
    from += BATCH_SIZE;
  } while (
    allResults.length < totalCount &&
    allResults.length < MAX_SEARCH_RESULTS
  );

  const timestamp = formatNow(FORMATS.LOG_TIMESTAMP);
  applicationContext.logger.info('public opinion search', {
    ...omit(rawSearch, 'entityName'),
    timestamp,
    totalCount,
  });

  const filteredResults = allResults.slice(0, MAX_SEARCH_RESULTS);

  return PublicDocumentSearchResult.validateRawCollection(filteredResults);
};
