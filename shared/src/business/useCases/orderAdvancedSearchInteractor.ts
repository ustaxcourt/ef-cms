import { DocumentSearch } from '../../business/entities/documents/DocumentSearch';
import { FORMATS, formatNow } from '../../business/utilities/DateHandler';
import { InternalDocumentSearchResult } from '../entities/documents/InternalDocumentSearchResult';
import {
  MAX_SEARCH_RESULTS,
  ORDER_EVENT_CODES,
} from '../entities/EntityConstants';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../authorization/authorizationClientService';
import { UnauthorizedError } from '@web-api/errors/errors';
import { User } from '../entities/User';
import { caseSearchFilter } from '../utilities/caseFilter';
import { omit } from 'lodash';

export const orderAdvancedSearchInteractor = async (
  applicationContext: IApplicationContext,
  {
    caseTitleOrPetitioner,
    dateRange,
    docketNumber,
    endDate,
    from,
    judge,
    keyword,
    startDate,
  }: {
    caseTitleOrPetitioner: string;
    dateRange: string;
    docketNumber: string;
    endDate: string;
    from: string;
    judge: string;
    keyword: string;
    startDate: string;
  },
) => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.ADVANCED_SEARCH)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const orderSearch = new DocumentSearch({
    caseTitleOrPetitioner,
    dateRange,
    docketNumber,
    endDate,
    from,
    judge,
    keyword,
    startDate,
    userRole: authorizedUser.role,
  });

  const rawSearch = orderSearch.validate().toRawObject();

  const { results, totalCount } = await applicationContext
    .getPersistenceGateway()
    .advancedDocumentSearch({
      applicationContext,
      documentEventCodes: ORDER_EVENT_CODES,
      omitSealed: false,
      ...rawSearch,
      isExternalUser: User.isExternalUser(authorizedUser.role),
    });

  const timestamp = formatNow(FORMATS.LOG_TIMESTAMP);
  applicationContext.logger.info('private order search', {
    ...omit(rawSearch, 'entityName'),
    timestamp,
    totalCount,
    userId: authorizedUser.userId,
    userRole: authorizedUser.role,
  });

  const filteredResults = caseSearchFilter(results, authorizedUser).slice(
    0,
    MAX_SEARCH_RESULTS,
  );

  return InternalDocumentSearchResult.validateRawCollection(filteredResults, {
    applicationContext,
  });
};
