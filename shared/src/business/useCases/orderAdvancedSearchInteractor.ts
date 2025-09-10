import { FORMATS, formatNow } from '@shared/business/utilities/DateHandler';
import {
  OPENSEARCH_DOCUMENT_SEARCH_MAX_BATCHES_PER_QUERY,
  MAX_SEARCH_RESULTS,
  ORDER_EVENT_CODES,
  OPENSEARCH_DOCUMENT_SEARCH_SINGLE_BATCH_SIZE,
} from '@shared/business/entities/EntityConstants';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { User } from '@shared/business/entities/User';
import { omit } from 'lodash';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { DocumentSearch } from '@shared/business/entities/documents/DocumentSearch';
import { InternalDocumentSearchResult } from '@shared/business/entities/documents/InternalDocumentSearchResult';
import { filterCaseSearchResultsNotAccessibleToUser } from '@shared/business/utilities/caseFilter';

export const orderAdvancedSearchInteractor = async (
  applicationContext: ServerApplicationContext,
  rawParams: any,
  authorizedUser: UnknownAuthUser,
) => {
  const params =
    rawParams && rawParams.searchParams ? rawParams.searchParams : rawParams;
  const {
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
  } = params || {};
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.ADVANCED_SEARCH)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const orderSearch = new DocumentSearch({
    caseTitleOrPetitioner,
    dateRange,
    docketNumber,
    endDate,
    judge,
    keyword,
    startDate,
    from,
    userRole: authorizedUser.role,
  });

  const rawSearch = orderSearch.validate().toRawObject();

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
        documentEventCodes: ORDER_EVENT_CODES,
        omitSealed: false,
        ...rawSearch,
        isExternalUser: User.isExternalUser(authorizedUser.role),
        overrideResultSize: OPENSEARCH_DOCUMENT_SEARCH_SINGLE_BATCH_SIZE,
        searchAfter:
          cursor && opensearchDocumentSearchBatchCount === 0
            ? cursor
            : searchAfter,
      });
    opensearchDocumentSearchBatchCount++;

    if (rawResults.length === 0) {
      break;
    }

    const filteredBatch = filterCaseSearchResultsNotAccessibleToUser(
      rawResults,
      authorizedUser,
    );
    for (const r of filteredBatch) {
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

  applicationContext.logger.info('private order search', {
    ...omit(rawSearch, 'entityName'),
    timestamp,
    userId: authorizedUser.userId,
    userRole: authorizedUser.role,
  });

  const overFetched = accumulated.length > desired;
  if (overFetched) {
    if (accumulated[desired - 1]?.sort) {
      nextCursor = accumulated[desired - 1].sort;
    }
    accumulated.length = desired;
  }
  const validatedFiltered =
    InternalDocumentSearchResult.validateRawCollection(accumulated);
  return {
    results: validatedFiltered,
    moreResults: overFetched,
    nextCursor: overFetched ? nextCursor : undefined,
  };
};
