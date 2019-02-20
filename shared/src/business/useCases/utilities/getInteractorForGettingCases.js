const { getCasesByUser } = require('../getCasesByUser.interactor');
const {
  getCasesForRespondent,
} = require('../respondent/getCasesForRespondent.interactor');
const { getCasesByDocumentId } = require('../getCasesByDocumentId.interactor');
const { getCasesByStatus } = require('../getCasesByStatus.interactor');
const {
  isAuthorized,
  GET_CASE,
  PETITION,
} = require('../../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 *
 * @param documentId
 * @param userId
 * @returns {*}
 */
exports.getInteractorForGettingCases = ({ documentId, applicationContext }) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, GET_CASE) && !isAuthorized(user, PETITION)) {
    throw new UnauthorizedError('Unauthorized');
  }

  switch (user.role) {
    case 'petitioner':
      return getCasesByUser;
    case 'respondent':
      return getCasesForRespondent;
    case 'docketclerk':
    case 'petitionsclerk':
    case 'seniorattorney':
    case 'intakeclerk':
      if (documentId) {
        return getCasesByDocumentId;
      } else {
        return getCasesByStatus;
      }
    default:
      throw new Error('invalid use case');
  }
};
