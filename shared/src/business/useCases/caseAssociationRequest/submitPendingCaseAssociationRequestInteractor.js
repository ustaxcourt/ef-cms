const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 * submitPendingCaseAssociationRequestInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketNumber the docket number of the case
 * @returns {Promise<*>} the promise of the pending case association request
 */
exports.submitPendingCaseAssociationRequestInteractor = async (
  applicationContext,
  { docketNumber },
) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.ASSOCIATE_SELF_WITH_CASE)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const caseDetail = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({
      applicationContext,
      docketNumber,
    });

  const isPrivatePractitionerOnCase = caseDetail.privatePractitioners?.some(
    practitioner => practitioner.userId === user.userId,
  );

  if (isPrivatePractitionerOnCase) {
    throw new Error(
      `The Private Practitioner is already associated with case ${docketNumber}.`,
    );
  }

  const isAssociationPending = await applicationContext
    .getPersistenceGateway()
    .verifyPendingCaseForUser({
      applicationContext,
      docketNumber,
      userId: user.userId,
    });

  if (!isPrivatePractitionerOnCase && !isAssociationPending) {
    await applicationContext
      .getPersistenceGateway()
      .associateUserWithCasePending({
        applicationContext,
        docketNumber,
        userId: user.userId,
      });
  }
};
