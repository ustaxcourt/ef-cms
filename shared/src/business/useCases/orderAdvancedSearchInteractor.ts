import { DocumentSearch } from '../../business/entities/documents/DocumentSearch';
import { FORMATS, formatNow } from '../../business/utilities/DateHandler';
import { InternalDocumentSearchResult } from '../entities/documents/InternalDocumentSearchResult';
import {
  ADVANCED_DOCUMENT_SEARCH_PAGE_SIZE,
  // MAX_SEARCH_RESULTS,
  ORDER_EVENT_CODES,
} from '../entities/EntityConstants';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../authorization/authorizationClientService';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { User } from '../entities/User';
import { filterCaseSearchResultsNotAccessibleToUser } from '../utilities/caseFilter';
import { omit } from 'lodash';
import { ServerApplicationContext } from '@web-api/applicationContext';
// import { advancedDocumentSearch } from '@web-api/persistence/elasticsearch/advancedDocumentSearch';

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
    columnName,
    direction,
    currentPaginationPage,
  }: {
    caseTitleOrPetitioner: string;
    dateRange: string;
    docketNumber: string;
    endDate: string;
    judge: string;
    keyword: string;
    startDate: string;
    columnName:
      | 'formattedFiledDate'
      | 'documentTitle'
      | 'caseTitle'
      | 'formattedJudgeName'
      | 'numberOfPagesFormatted'
      | 'docketNumber';
    direction: 'asc' | 'desc';
    currentPaginationPage: 'number';
  },
  authorizedUser: UnknownAuthUser,
) => {
  console.log('ColumnName: ', columnName);
  console.log('Direction: ', direction);

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
  const sortingColumnMapping = {
    formattedFiledDate: 'filingDate',
    documentTitle: 'documentTitle',
    caseTitle: 'caseCaption',
    formattedJudgeName: 'judge',
    numberOfPagesFormatted: 'numberOfPages',
    docketNumber: 'docketNumber',
  };

  const from = (currentPaginationPage - 1) * ADVANCED_DOCUMENT_SEARCH_PAGE_SIZE;

  const { results, totalCount } = await applicationContext
    .getPersistenceGateway()
    .advancedDocumentSearch({
      applicationContext,
      documentEventCodes: ORDER_EVENT_CODES,
      omitSealed: false,
      ...rawSearch,
      isExternalUser: User.isExternalUser(authorizedUser.role),
      sortField: sortingColumnMapping[columnName],
    });

  const timestamp = formatNow(FORMATS.LOG_TIMESTAMP);
  applicationContext.logger.info('private order search', {
    ...omit(rawSearch, 'entityName'),
    timestamp,
    totalCount,
    userId: authorizedUser.userId,
    userRole: authorizedUser.role,
  });

  const filteredResults = filterCaseSearchResultsNotAccessibleToUser(
    results,
    authorizedUser,
  ).slice(from, from + ADVANCED_DOCUMENT_SEARCH_PAGE_SIZE);
  console.log('FILTEREDRESULTS:', filteredResults);
  return {
    results:
      InternalDocumentSearchResult.validateRawCollection(filteredResults),
    totalCount, // if total count is > 10k, only return 10k results
  };
};
