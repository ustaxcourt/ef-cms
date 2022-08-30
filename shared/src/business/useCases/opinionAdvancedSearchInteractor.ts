import { DocumentSearch } from '../../business/entities/documents/DocumentSearch';
import { InternalDocumentSearchResult } from '../entities/documents/InternalDocumentSearchResult';
import {
  isAuthorized,
  ROLE_PERMISSIONS,
} from '../../authorization/authorizationClientService';
import { MAX_SEARCH_RESULTS } from '../../business/entities/EntityConstants';
import { formatNow, FORMATS } from '../utilities/DateHandler';
import { omit } from 'lodash';
import { UnauthorizedError } from '../../errors/errors';

/**
 * opinionAdvancedSearchInteractor
 *
 * @param {object} applicationContext api applicationContext
 * @param {object} providers providers object
 * @param {object} providers.keyword keyword used for searching opinions
 * @returns {object} the opinions data
 */
export const opinionAdvancedSearchInteractor = async (
  applicationContext,
  {
    caseTitleOrPetitioner,
    dateRange,
    docketNumber,
    endDate,
    judge,
    keyword,
    opinionTypes,
    startDate,
  },
) => {
  const authorizedUser = applicationContext.getCurrentUser();

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

  const { results, totalCount } = await applicationContext
    .getPersistenceGateway()
    .advancedDocumentSearch({
      applicationContext,
      documentEventCodes: opinionTypes,
      isOpinionSearch: true,
      ...rawSearch,
    });

  const timestamp = formatNow(FORMATS.LOG_TIMESTAMP);
  await applicationContext.logger.info('private opinion search', {
    ...omit(rawSearch, 'entityName'),
    timestamp,
    totalCount,
    userId: authorizedUser.userId,
    userRole: authorizedUser.role,
  });

  const filteredResults = results.slice(0, MAX_SEARCH_RESULTS);

  return InternalDocumentSearchResult.validateRawCollection(filteredResults, {
    applicationContext,
  });
};
