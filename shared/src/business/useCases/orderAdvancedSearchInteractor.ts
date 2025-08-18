import { FORMATS, formatNow } from '@shared/business/utilities/DateHandler';
import {
  MAX_SEARCH_RESULTS,
  ORDER_EVENT_CODES,
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
import { InternalDocumentSearchResult } from '../entities/documents/InternalDocumentSearchResult';
import { filterCaseSearchResultsNotAccessibleToUser } from '../utilities/caseFilter';

export const orderAdvancedSearchInteractor = async (
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
  authorizedUser: UnknownAuthUser,
) => {
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
    userRole: authorizedUser.role,
  });

  const rawSearch = orderSearch.validate().toRawObject();

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
        documentEventCodes: ORDER_EVENT_CODES,
        omitSealed: false,
        ...rawSearch,
        isExternalUser: User.isExternalUser(authorizedUser.role),
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

  applicationContext.logger.info('private order search', {
    ...omit(rawSearch, 'entityName'),
    timestamp,
    totalCount,
    userId: authorizedUser.userId,
    userRole: authorizedUser.role,
  });

  const filteredResults = filterCaseSearchResultsNotAccessibleToUser(
    allResults,
    authorizedUser,
  ).slice(0, MAX_SEARCH_RESULTS);

  return InternalDocumentSearchResult.validateRawCollection(filteredResults);
};
