const {
  DocumentSearch,
} = require('../../business/entities/documents/DocumentSearch');
const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../authorization/authorizationClientService');
const {
  ORDER_EVENT_CODES,
} = require('../../business/entities/EntityConstants');
const { caseSearchFilter } = require('../utilities/caseFilter');
const { UnauthorizedError } = require('../../errors/errors');

/**
 * orderAdvancedSearchInteractor
 *
 * @param {object} providers the providers object containing applicationContext, keyword, caseTitleOrPetitioner, docketNumber, judge, startDate, endDate
 * @returns {object} the orders data
 */
exports.orderAdvancedSearchInteractor = async ({
  applicationContext,
  caseTitleOrPetitioner,
  docketNumber,
  endDateDay,
  endDateMonth,
  endDateYear,
  judge,
  keyword,
  startDateDay,
  startDateMonth,
  startDateYear,
}) => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.ADVANCED_SEARCH)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const orderSearch = new DocumentSearch({
    caseTitleOrPetitioner,
    docketNumber,
    endDateDay,
    endDateMonth,
    endDateYear,
    judge,
    keyword,
    startDateDay,
    startDateMonth,
    startDateYear,
  });

  const rawSearch = orderSearch.validate().toRawObject();

  const results = await applicationContext
    .getPersistenceGateway()
    .advancedDocumentSearch({
      applicationContext,
      documentEventCodes: ORDER_EVENT_CODES,
      judgeType: 'signedJudgeName',
      ...rawSearch,
    });

  const filteredResults = caseSearchFilter(results, authorizedUser);

  return filteredResults;
};
