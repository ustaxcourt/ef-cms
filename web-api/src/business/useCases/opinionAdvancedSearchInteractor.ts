import { omit } from 'lodash';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { DocumentSearch } from '@web-api/business/entities/documents/DocumentSearch';
import {
  InternalDocumentSearchResult,
  RawInternalDocumentSearchResult,
} from '@shared/business/entities/documents/InternalDocumentSearchResult';
import { MAX_DOCUMENT_SEARCH_RESULTS } from '@shared/business/entities/EntityConstants';
import { FORMATS, formatNow } from '@shared/business/utilities/DateHandler';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';

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
    limit = MAX_DOCUMENT_SEARCH_RESULTS,
  }: {
    caseTitleOrPetitioner: string;
    dateRange: string;
    docketNumber: string;
    endDate: string;
    judge: string;
    keyword: string;
    opinionTypes: string[];
    startDate: string;
    limit?: number;
  },
  authorizedUser: UnknownAuthUser,
): Promise<{
  results: RawInternalDocumentSearchResult[];
}> => {
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
    from: 0,
  });

  const rawSearch = opinionSearch.validate().toRawObject();

  const accessible: any[] = [];
  let searchAfter: any[] | undefined = undefined;
  const maxCeiling = Math.min(MAX_DOCUMENT_SEARCH_RESULTS, limit);

  while (accessible.length < limit) {
    const sizeNeeded = limit - accessible.length;
    const { results: rawBatch } = await applicationContext
      .getPersistenceGateway()
      .advancedDocumentSearch({
        applicationContext,
        documentEventCodes: opinionTypes,
        isOpinionSearch: true,
        ...rawSearch,
        overrideResultSize: sizeNeeded,
        searchAfter,
      });

    if (rawBatch.length === 0) break;

    for (const r of rawBatch) {
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

  applicationContext.logger.info('private opinion search', {
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
