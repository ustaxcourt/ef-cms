import { DocumentSearch } from '@shared/business/entities/documents/DocumentSearch';
import { FORMATS, formatNow } from '@shared/business/utilities/DateHandler';
import { InternalDocumentSearchResult } from '@shared/business/entities/documents/InternalDocumentSearchResult';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { omit } from 'lodash';
import { ServerApplicationContext } from '@web-api/applicationContext';
import {
  MAX_FETCH_BATCHES,
  MAX_SEARCH_RESULTS,
  RAW_BATCH_SIZE,
} from '@shared/business/entities/EntityConstants';

export const opinionAdvancedSearchInteractor = async (
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
  authorizedUser: UnknownAuthUser,
) => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.ADVANCED_SEARCH)) {
    throw new UnauthorizedError('Unauthorized');
  }

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
  applicationContext.logger.info('private opinion search', {
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

  const validated =
    InternalDocumentSearchResult.validateRawCollection(accumulated);
  return {
    results: validated,
    moreResults: overFetched,
    nextCursor: overFetched ? nextCursor : undefined,
  };
};
