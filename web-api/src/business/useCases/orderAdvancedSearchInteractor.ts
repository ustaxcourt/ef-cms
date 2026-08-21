import { omit } from 'lodash';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import {
  ORDER_EVENT_CODES,
  MAX_DOCUMENT_SEARCH_RESULTS,
} from '@shared/business/entities/EntityConstants';
import { User } from '@shared/business/entities/User';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { DocumentSearch } from '@web-api/business/entities/documents/DocumentSearch';
import {
  InternalDocumentSearchResult,
  RawInternalDocumentSearchResult,
} from '@shared/business/entities/documents/InternalDocumentSearchResult';
import { FORMATS, formatNow } from '@shared/business/utilities/DateHandler';
import { filterCaseSearchResultsNotAccessibleToUser } from '@web-api/business/utilities/caseFilter';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';

export const orderAdvancedSearchInteractor = async (
  applicationContext: ServerApplicationContext,
  rawParams: any,
  authorizedUser: UnknownAuthUser,
): Promise<{
  results: RawInternalDocumentSearchResult[];
}> => {
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
    limit = MAX_DOCUMENT_SEARCH_RESULTS,
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
    from: 0,
    userRole: authorizedUser.role,
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
        omitSealed: false,
        ...rawSearch,
        isExternalUser: User.isExternalUser(authorizedUser.role),
        overrideResultSize: sizeNeeded,
        searchAfter,
      });

    if (rawBatch.length === 0) break;

    const filteredBatch = filterCaseSearchResultsNotAccessibleToUser(
      rawBatch,
      authorizedUser,
    );

    for (const r of filteredBatch) {
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

  applicationContext.logger.info('private order search', {
    ...omit(rawSearch, 'entityName'),
    timestamp,
    userId: authorizedUser.userId,
    userRole: authorizedUser.role,
  });

  const validated =
    InternalDocumentSearchResult.validateRawCollection(accessible);

  return {
    results: validated,
  };
};
