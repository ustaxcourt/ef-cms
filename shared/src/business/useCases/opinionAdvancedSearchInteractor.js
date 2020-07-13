const {
  DocumentSearch,
} = require('../../business/entities/documents/DocumentSearch');
const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../authorization/authorizationClientService');
const {
  OPINION_EVENT_CODES,
} = require('../../business/entities/EntityConstants');
const { UnauthorizedError } = require('../../errors/errors');

/**
 * opinionAdvancedSearchInteractor
 *
 * @param {object} providers providers object
 * @param {object} providers.applicationContext api applicationContext
 * @param {object} providers.keyword keyword used for searching opinions
 * @returns {object} the opinions data
 */
exports.opinionAdvancedSearchInteractor = async ({
  applicationContext,
  caseTitleOrPetitioner,
  docketNumber,
  endDateDay,
  endDateMonth,
  endDateYear,
  judge,
  keyword,
  opinionType,
  startDateDay,
  startDateMonth,
  startDateYear,
}) => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.ADVANCED_SEARCH)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const opinionSearch = new DocumentSearch({
    caseTitleOrPetitioner,
    docketNumber,
    endDateDay,
    endDateMonth,
    endDateYear,
    judge,
    keyword,
    opinionType,
    startDateDay,
    startDateMonth,
    startDateYear,
  });

  const rawSearch = opinionSearch.validate().toRawObject();

  const results = await applicationContext
    .getPersistenceGateway()
    .advancedDocumentSearch({
      applicationContext,
      documentEventCodes: OPINION_EVENT_CODES,
      judgeType: 'judge',
      ...rawSearch,
    });

  return results;
};
