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
import { MAX_SEARCH_RESULTS } from '@shared/business/entities/EntityConstants';

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

  const { results } = await applicationContext
    .getPersistenceGateway()
    .advancedDocumentSearch({
      applicationContext,
      documentEventCodes: opinionTypes,
      isOpinionSearch: true,
      ...rawSearch,
      from,
      overrideResultSize: limit,
    });

  const timestamp = formatNow(FORMATS.LOG_TIMESTAMP);

  applicationContext.logger.info('private opinion search', {
    ...omit(rawSearch, 'entityName'),
    timestamp,
    userId: authorizedUser.userId,
    userRole: authorizedUser.role,
  });

  return {
    results: InternalDocumentSearchResult.validateRawCollection(results).slice(
      0,
      MAX_SEARCH_RESULTS,
    ),
  };
};
