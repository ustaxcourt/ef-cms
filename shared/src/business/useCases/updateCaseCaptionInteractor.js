const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../errors/errors');

const { Case } = require('../entities/cases/Case');

/**
 * updateCaseCaptionInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseId the id of the case to update
 * @param {object} providers.caseCaption the caption to set on the case
 * @returns {object} the updated case data
 */

exports.updateCaseCaptionInteractor = async ({
  applicationContext,
  caseCaption,
  caseId,
}) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.UPDATE_CASE)) {
    throw new UnauthorizedError('Unauthorized for update case');
  }

  const oldCase = applicationContext
    .getPersistenceGateway()
    .getCaseByCaseId({ applicationContext, caseId });

  const newCase = new Case({ ...oldCase, caseCaption }, { applicationContext })
    .validate()
    .toRawObject();

  return await applicationContext.getPersistenceGateway().updateCase({
    applicationContext,
    caseToUpdate: newCase,
  });
};
