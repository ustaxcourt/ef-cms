const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../authorization/authorizationClientService');
const { Case } = require('../entities/cases/Case');
const { CASE_STATUS_TYPES } = require('../entities/EntityConstants');
const { TrialSession } = require('../entities/trialSessions/TrialSession');
const { UnauthorizedError } = require('../../errors/errors');
const { User } = require('../entities/User');
const { UserCase } = require('../entities/UserCase');

/**
 * Creates a new user account for a case if one does not already exist
 * or associates an existing user account with the case
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.caseEntity the case entity to associate the user with
 * @param {string} providers.contactType contactPrimary or contactSecondary
 * @param {object} providers.user the user to associate with the case
 * @returns {object} the updated case entity
 */
const createUserAccount = async ({
  applicationContext,
  caseEntity,
  contactData,
  contactType,
}) => {
  const foundUser = await applicationContext
    .getPersistenceGateway()
    .getUserByEmail({
      applicationContext,
      email: caseEntity[contactType].email,
    });

  if (foundUser) {
    caseEntity[contactType].contactId = foundUser.userId;
  } else {
    const userToAdd = new User({
      ...contactData,
      contact: undefined, // petitioners should never have this defined
      userId: contactData.contactId, // this will be overwritten in createUser to the userId that cognito generates
    });

    const newUser = await applicationContext
      .getPersistenceGateway()
      .createMigratedPetitionerUser({
        applicationContext,
        user: userToAdd.validate().toRawObject(),
      });

    caseEntity[contactType].contactId = newUser.userId; // update contactId to match the userId cognito generates
  }

  const userCaseEntity = new UserCase(caseEntity).validate().toRawObject();
  await applicationContext.getPersistenceGateway().associateUserWithCase({
    applicationContext,
    docketNumber: caseEntity.docketNumber,
    userCase: userCaseEntity,
    userId: caseEntity[contactType].contactId,
  });
  return caseEntity;
};

exports.createUserAccount = createUserAccount;

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

  if (caseMetadata && caseMetadata.docketNumber) {
    const docketNumber = Case.formatDocketNumber(caseMetadata.docketNumber);

    const caseToDelete = await applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber({
        applicationContext,
        docketNumber,
      });

    if (caseToDelete) {
      await Promise.all([
        applicationContext
          .getPersistenceGateway()
          .deleteCaseByDocketNumber({ applicationContext, docketNumber }),
      ]);
    }
  }

  let caseToAdd = new Case(
    {
      ...caseMetadata,
      userId: user.userId,
    },
    {
      applicationContext,
    },
  );

  for (let casePractitioner of [
    ...caseToAdd.privatePractitioners,
    ...caseToAdd.irsPractitioners,
  ]) {
    const practitioner = await applicationContext
      .getPersistenceGateway()
      .getPractitionerByBarNumber({
        applicationContext,
        barNumber: casePractitioner.barNumber,
      });

    if (practitioner) {
      casePractitioner.contact = practitioner.contact;
      casePractitioner.email = practitioner.email;
      casePractitioner.name = practitioner.name;
      casePractitioner.userId = practitioner.userId;

      const userCaseEntity = new UserCase(caseToAdd);

      await applicationContext.getPersistenceGateway().associateUserWithCase({
        applicationContext,
        docketNumber: caseToAdd.docketNumber,
        userCase: userCaseEntity.validate().toRawObject(),
        userId: practitioner.userId,
      });
    } else {
      casePractitioner.userId = applicationContext.getUniqueId();
    }
  }

  if (caseToAdd.trialSessionId) {
    const trialSessionData = await applicationContext
      .getPersistenceGateway()
      .getTrialSessionById({
        applicationContext,
        trialSessionId: caseToAdd.trialSessionId,
      });

    if (!trialSessionData) {
      throw new Error(
        `Trial Session not found with id ${caseToAdd.trialSessionId}`,
      );
    }

    const trialSessionEntity = new TrialSession(trialSessionData, {
      applicationContext,
    });

    trialSessionEntity.addCaseToCalendar(caseToAdd);

    await applicationContext.getPersistenceGateway().updateTrialSession({
      applicationContext,
      trialSessionToUpdate: trialSessionEntity.validate().toRawObject(),
    });

    caseToAdd.setAsCalendared(trialSessionEntity);
  }

  caseToAdd.validateForMigration();

  const contactTypes = ['contactPrimary', 'contactSecondary'];

  for (const contactType of contactTypes) {
    if (caseToAdd[contactType]) {
      const shouldCreateUserAccount =
        !!caseToAdd[contactType].hasEAccess &&
        caseToAdd.status !== CASE_STATUS_TYPES.closed;
      if (shouldCreateUserAccount) {
        caseToAdd = await createUserAccount({
          applicationContext,
          caseEntity: caseToAdd,
          contactData: caseToAdd[contactType],
          contactType,
        });
      } else {
        caseToAdd[contactType].hasEAccess = false;
      }
    }
  }

  const caseValidatedRaw = caseToAdd.validateForMigration().toRawObject();

  await applicationContext.getPersistenceGateway().createCase({
    applicationContext,
    caseToCreate: caseValidatedRaw,
  });

  for (const correspondenceEntity of caseToAdd.correspondence) {
    await applicationContext.getPersistenceGateway().updateCaseCorrespondence({
      applicationContext,
      correspondence: correspondenceEntity.validate().toRawObject(),
      docketNumber: caseValidatedRaw.docketNumber,
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
