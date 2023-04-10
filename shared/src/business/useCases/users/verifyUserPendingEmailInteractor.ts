import { Case } from '../../entities/cases/Case';
import { Practitioner } from '../../entities/Practitioner';
import { ROLES, SERVICE_INDICATOR_TYPES } from '../../entities/EntityConstants';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import {
  ServiceUnavailableError,
  UnauthorizedError,
} from '../../../errors/errors';
import { User } from '../../entities/User';
import { acquireLock } from '../../useCaseHelper/acquireLock';
import { aggregatePartiesForService } from '../../utilities/aggregatePartiesForService';

const updateCaseEntityAndGenerateChange = async ({
  applicationContext,
  rawCaseData,
  user,
}: {
  applicationContext: IApplicationContext;
  rawCaseData: TCase;
  user: RawUser;
}) => {
  const caseEntity = new Case(rawCaseData, {
    applicationContext,
  });

  const petitionerObject = caseEntity.getPetitionerById(user.userId);
  console.log({ petitionerObject, petitioners: caseEntity.petitioners, user });
  if (!petitionerObject) {
    applicationContext.logger.error(
      `Could not find user|${user.userId} on ${caseEntity.docketNumber}`,
    );
    return;
  }

  console.log(petitionerObject);

  const oldEmail = petitionerObject.email;
  const newData = {
    email: user.email,
    name: petitionerObject.name,
  };

  const oldData = { email: oldEmail };
  petitionerObject.email = user.email;

  console.log(petitionerObject);

  if (
    !caseEntity.isUserIdRepresentedByPrivatePractitioner(
      petitionerObject.contactId,
    )
  ) {
    petitionerObject.serviceIndicator = SERVICE_INDICATOR_TYPES.SI_ELECTRONIC;
  }

  console.log(
    caseEntity.isUserIdRepresentedByPrivatePractitioner(
      petitionerObject.contactId,
    ),
  );
  console.log(petitionerObject);
  console.log(caseEntity.petitioners);
  const servedParties = aggregatePartiesForService(caseEntity);
  console.log(servedParties);
  const documentType = applicationContext
    .getUtilities()
    .getDocumentTypeForAddressChange({ newData, oldData });

  const privatePractitionersRepresentingContact =
    caseEntity.isUserIdRepresentedByPrivatePractitioner(
      petitionerObject.contactId,
    );

  if (caseEntity.shouldGenerateNoticesForCase()) {
    console.log('notice of change of address');
    const { changeOfAddressDocketEntry } = await applicationContext
      .getUseCaseHelpers()
      .generateAndServeDocketEntry({
        applicationContext,
        caseEntity,
        documentType,
        newData,
        oldData,
        privatePractitionersRepresentingContact,
        servedParties,
        user,
      });
    caseEntity.addDocketEntry(changeOfAddressDocketEntry);
  }

  console.log('done');
  return caseEntity.validate();
};

export const updateCasesForPetitioner = async ({
  applicationContext,
  docketNumbersAssociatedWithUser,
  user,
}) => {
  const rawCasesToUpdate = await Promise.all(
    docketNumbersAssociatedWithUser.map(docketNumber =>
      applicationContext.getPersistenceGateway().getCaseByDocketNumber({
        applicationContext,
        docketNumber,
      }),
    ),
  );

  console.log(rawCasesToUpdate[0].petitioners);

  const validatedCasesToUpdateInPersistence = [];
  for (let rawCaseData of rawCasesToUpdate) {
    validatedCasesToUpdateInPersistence.push(
      await updateCaseEntityAndGenerateChange({
        applicationContext,
        rawCaseData,
        user,
      }),
    );
  }
  const filteredCasesToUpdateInPersistence =
    validatedCasesToUpdateInPersistence.filter(Boolean);

  return Promise.all(
    filteredCasesToUpdateInPersistence.map(caseToUpdate =>
      applicationContext.getUseCaseHelpers().updateCaseAndAssociations({
        applicationContext,
        caseToUpdate,
      }),
    ),
  );
};

/**
 * updatePractitionerCases
 * for the provided user, update their email address on all cases
 * where they are an IRS practitioner or private practitioner, sending an
 * update to the practitioner for each case updated, as well as a final email when
 * all case updates have been completed.
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.user the user who is a primary or secondary contact on a case
 * @returns {Promise} resolves upon completion of case updates
 */
export const updatePractitionerCases = async ({
  applicationContext,
  docketNumbersAssociatedWithUser,
  user,
}: {
  applicationContext: IApplicationContext;
  docketNumbersAssociatedWithUser: string[];
  user: any;
}) => {
  const casesToUpdate = await Promise.all(
    docketNumbersAssociatedWithUser.map(docketNumber =>
      applicationContext.getPersistenceGateway().getCaseByDocketNumber({
        applicationContext,
        docketNumber,
      }),
    ),
  );

  const validCasesToUpdate = casesToUpdate
    .map(caseToUpdate => {
      const caseEntity = new Case(caseToUpdate, { applicationContext });
      const practitionerObject = [
        ...caseEntity.privatePractitioners,
        ...caseEntity.irsPractitioners,
      ].find(practitioner => practitioner.userId === user.userId);

      if (!practitionerObject) {
        applicationContext.logger.error(
          `Could not find user|${user.userId} barNumber: ${user.barNumber} on ${caseToUpdate.docketNumber}`,
        );
        return;
      }
      // This updates the case by reference!
      practitionerObject.email = user.email;
      practitionerObject.serviceIndicator =
        SERVICE_INDICATOR_TYPES.SI_ELECTRONIC;

      // we do this again so that it will convert '' to null
      return new Case(caseEntity, { applicationContext }).validate();
    })
    // if practitioner is not found on the case, function exits early and returns `undefined`.
    // if this happens, continue with remaining cases and do not throw exception, but discard
    // any undefined values by filtering for truthy objects.
    .filter(Boolean);

  for (let idx = 0; idx < validCasesToUpdate.length; idx++) {
    const validatedCaseToUpdate = validCasesToUpdate[idx];
    await applicationContext.getUseCaseHelpers().updateCaseAndAssociations({
      applicationContext,
      caseToUpdate: validatedCaseToUpdate,
    });

    await applicationContext.getNotificationGateway().sendNotificationToUser({
      applicationContext,
      message: {
        action: 'user_contact_update_progress',
        completedCases: idx + 1,
        totalCases: validCasesToUpdate.length,
      },
      userId: user.userId,
    });
  }

  await applicationContext.getNotificationGateway().sendNotificationToUser({
    applicationContext,
    message: {
      action: 'user_contact_full_update_complete',
    },
    userId: user.userId,
  });

  return validCasesToUpdate;
};

/**
 * verifyUserPendingEmailInteractor
 *
 * this interactor is invoked when a petitioner logs into DAWSON
 * and changes their email to a different email address and clicks the
 * verify link that was sent to their new email address.
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.pendingEmail the pending email
 */
export const verifyUserPendingEmailInteractor = async (
  applicationContext: IApplicationContext,
  { token }: { token: string },
) => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.EMAIL_MANAGEMENT)) {
    throw new UnauthorizedError('Unauthorized to manage emails.');
  }

  const user = await applicationContext
    .getPersistenceGateway()
    .getUserById({ applicationContext, userId: authorizedUser.userId });

  const docketNumbersAssociatedWithUser = await applicationContext
    .getPersistenceGateway()
    .getDocketNumbersByUser({
      applicationContext,
      userId: user.userId,
    });

  await acquireLock({
    applicationContext,
    identifier: docketNumbersAssociatedWithUser,
    onLockError: new ServiceUnavailableError(
      'One of the cases is currently being updated',
    ),
    prefix: 'case',
    ttl: 900,
  });

  let userEntity;
  if (user.role === ROLES.petitioner) {
    userEntity = new User(user);
  } else {
    userEntity = new Practitioner(user);
  }

  if (
    !userEntity.pendingEmailVerificationToken ||
    userEntity.pendingEmailVerificationToken !== token
  ) {
    throw new UnauthorizedError('Tokens do not match');
  }

  const isEmailAvailable = await applicationContext
    .getPersistenceGateway()
    .isEmailAvailable({
      applicationContext,
      email: userEntity.pendingEmail,
    });

  if (!isEmailAvailable) {
    throw new Error('Email is not available');
  }

  await applicationContext.getPersistenceGateway().updateUserEmail({
    applicationContext,
    user: userEntity.validate().toRawObject(),
  });

  userEntity.email = userEntity.pendingEmail;
  userEntity.pendingEmail = undefined;
  userEntity.pendingEmailVerificationToken = undefined;

  const updatedRawUser = userEntity.validate().toRawObject();
  await applicationContext.getPersistenceGateway().updateUser({
    applicationContext,
    user: updatedRawUser,
  });

  try {
    console.log(docketNumbersAssociatedWithUser);
    if (userEntity.role === ROLES.petitioner) {
      console.log('petitioner!');
      await updateCasesForPetitioner({
        applicationContext,
        docketNumbersAssociatedWithUser,
        user: updatedRawUser,
      });
    } else if (userEntity.role === ROLES.privatePractitioner) {
      console.log('practitioner!');
      await updatePractitionerCases({
        applicationContext,
        docketNumbersAssociatedWithUser,
        user: updatedRawUser,
      });
    }
    await Promise.all(
      docketNumbersAssociatedWithUser.map(docketNumber =>
        applicationContext.getPersistenceGateway().removeLock({
          applicationContext,
          identifier: docketNumber,
          prefix: 'case',
        }),
      ),
    );
  } catch (error) {
    applicationContext.logger.error('Unable to verify pending user email', {
      error,
    });
    throw error;
  }
};
