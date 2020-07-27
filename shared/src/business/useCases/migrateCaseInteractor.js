const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../authorization/authorizationClientService');
const { Case } = require('../entities/cases/Case');
const { UnauthorizedError } = require('../../errors/errors');

/**
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.caseMetadata the case metadata
 * @returns {object} the created case
 */
exports.migrateCaseInteractor = async ({
  applicationContext,
  caseMetadata,
}) => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.MIGRATE_CASE)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const user = await applicationContext
    .getPersistenceGateway()
    .getUserById({ applicationContext, userId: authorizedUser.userId });

  const caseToAdd = new Case(
    {
      ...caseMetadata,
      userId: user.userId,
    },
    {
      applicationContext,
    },
  );

  for (const privatePractitioner of caseToAdd.privatePractitioners) {
    const practitioner = await applicationContext
      .getPersistenceGateway()
      .getPractitionerByBarNumber({
        applicationContext,
        barNumber: privatePractitioner.barNumber,
      });

    privatePractitioner.userId = practitioner
      ? practitioner.userId
      : applicationContext.getUniqueId();
  }

  for (const irsPractitioner of caseToAdd.irsPractitioners) {
    const practitioner = await applicationContext
      .getPersistenceGateway()
      .getPractitionerByBarNumber({
        applicationContext,
        barNumber: irsPractitioner.barNumber,
      });

    irsPractitioner.userId = practitioner
      ? practitioner.userId
      : applicationContext.getUniqueId();
  }

  const caseValidatedRaw = caseToAdd.validate().toRawObject();

  await applicationContext.getPersistenceGateway().createCase({
    applicationContext,
    caseToCreate: caseValidatedRaw,
  });

  for (const correspondenceEntity of caseToAdd.correspondence) {
    await applicationContext.getPersistenceGateway().fileCaseCorrespondence({
      applicationContext,
      correspondence: correspondenceEntity.validate().toRawObject(),
      docketNumber: caseToAdd.docketNumber,
    });
  }

  // when part of a consolidated case, run the update use case
  // which will link the cases together in DynamoDB
  if (caseToAdd.leadDocketNumber) {
    await applicationContext.getPersistenceGateway().updateCase({
      applicationContext,
      caseToUpdate: caseValidatedRaw,
    });
  }

  return caseValidatedRaw;
};
