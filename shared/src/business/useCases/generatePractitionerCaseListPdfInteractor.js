const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../authorization/authorizationClientService');
const { CASE_STATUS_TYPES } = require('../entities/EntityConstants');
const { partition } = require('lodash');
const { sortByDocketNumber } = require('../entities/cases/Case');
const { UnauthorizedError } = require('../../errors/errors');
/**
 * generatePractitionerCaseListPdfInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.userId the practitioner's user id
 * @returns {Object} returns an object of the PDF's fileId and url
 */
exports.generatePractitionerCaseListPdfInteractor = async (
  applicationContext,
  { userId },
) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.VIEW_PRACTITIONER_CASE_LIST)) {
    throw new UnauthorizedError('Unauthorized to view practitioners cases');
  }

  const cases = await applicationContext
    .getPersistenceGateway()
    .getCasesAssociatedWithUser({
      applicationContext,
      userId,
    });

  cases.sort(sortByDocketNumber).reverse();

  const [closedCases, openCases] = partition(
    cases,
    theCase => theCase.status === CASE_STATUS_TYPES.closed,
  );

  const pdf = await applicationContext
    .getDocumentGenerators()
    .practitionerCaseList({
      applicationContext,
      data: {
        closedCases,
        openCases,
      },
    });

  return await applicationContext.getUseCaseHelpers().saveFileAndGenerateUrl({
    applicationContext,
    file: pdf,
    useTempBucket: true,
  });
};
