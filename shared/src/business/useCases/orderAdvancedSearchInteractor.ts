import { omit } from 'lodash';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import {
  MAX_SEARCH_RESULTS,
  ORDER_EVENT_CODES,
} from '@shared/business/entities/EntityConstants';
import { User } from '@shared/business/entities/User';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { DocumentSearch } from '@shared/business/entities/documents/DocumentSearch';
import { InternalDocumentSearchResult } from '@shared/business/entities/documents/InternalDocumentSearchResult';
import { FORMATS, formatNow } from '@shared/business/utilities/DateHandler';
import { filterCaseSearchResultsNotAccessibleToUser } from '@shared/business/utilities/caseFilter';
import { openSearchBatchState } from '@shared/business/utilities/getOpenSearchBatchState';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';

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
        omitSealed: false,
        ...rawSearch,
        isExternalUser: User.isExternalUser(authorizedUser.role),
        overrideResultSize: sizeNeeded,
        searchAfter,
      });

    if (rawBatch.length === 0) {
      break;
    }

    const filteredBatch = filterCaseSearchResultsNotAccessibleToUser(
      rawBatch,
      authorizedUser,
    );

    for (const r of filteredBatch) {
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
  if (moreResults && accumulated[desired - 1]?.sort) {
    nextCursor = accumulated[desired - 1].sort;
  }

  const timestamp = formatNow(FORMATS.LOG_TIMESTAMP);

  applicationContext.logger.info('private order search', {
    ...omit(rawSearch, 'entityName'),
    timestamp,
    userId: authorizedUser.userId,
    userRole: authorizedUser.role,
  });

  const resultsPage = accumulated.slice(0, desired);

  const validated =
    InternalDocumentSearchResult.validateRawCollection(resultsPage);

  return {
    results: validated,
    moreResults,
    nextCursor: moreResults ? nextCursor : undefined,
  };
};
