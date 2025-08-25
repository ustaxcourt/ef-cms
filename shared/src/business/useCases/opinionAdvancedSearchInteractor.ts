import { DocumentSearch } from '../../business/entities/documents/DocumentSearch';
import { FORMATS, formatNow } from '../utilities/DateHandler';
import { InternalDocumentSearchResult } from '../entities/documents/InternalDocumentSearchResult';
import { MAX_SEARCH_RESULTS } from '../../business/entities/EntityConstants';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../authorization/authorizationClientService';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { omit } from 'lodash';
import { ServerApplicationContext } from '@web-api/applicationContext';

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
  applicationContext.logger.info('private opinion search', {
    ...omit(rawSearch, 'entityName'),
    timestamp,
    totalCount,
    userId: authorizedUser.userId,
    userRole: authorizedUser.role,
  });

  const filteredResults = allResults.slice(0, MAX_SEARCH_RESULTS);

  return InternalDocumentSearchResult.validateRawCollection(
    filteredResults,
  ).map(internalDocument => {
    return omit(internalDocument, 'entityName');
  });
};
