const {
  isAuthorized,
  UPDATE_CONTACT_INFO,
} = require('../../../authorization/authorizationClientService');
const { Case } = require('../../entities/cases/Case');
const { pick } = require('lodash');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 * updateUserContactInformationInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.userId the userId to update the contact info
 * @returns {Promise} an object is successful
 */
exports.updateUserContactInformationInteractor = async ({
  applicationContext,
  contactInfo,
  userId,
}) => {
  const authenticatedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authenticatedUser, UPDATE_CONTACT_INFO)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const user = await applicationContext
    .getPersistenceGateway()
    .getUserById({ applicationContext, userId });

  await applicationContext.getPersistenceGateway().updateUser({
    applicationContext,
    user: {
      ...user,
      ...pick(contactInfo, ['addressLine1', 'addressLine2', 'phone']),
    },
  });

  const userCases = await applicationContext
    .getPersistenceGateway()
    .getCasesByUser({
      applicationContext,
      userId,
    });

  const updatedCases = await Promise.all(
    userCases.map(userCase => {
      const caseEntity = new Case(userCase);

      const practitioner = caseEntity.practitioners.find(
        practitioner => practitioner.userId === userId,
      );
      if (practitioner) {
        Object.assign(practitioner, contactInfo);
      }

      const respondent = caseEntity.respondents.find(
        respondent => respondent.userId === userId,
      );
      if (respondent) {
        Object.assign(respondent, contactInfo);
      }

      const rawCase = caseEntity.validate().toRawObject();

      return applicationContext.getPersistenceGateway().updateCase({
        applicationContext,
        caseToUpdate: rawCase,
      });
    }),
  );

  return updatedCases;
};
