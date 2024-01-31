import { Case } from '../../entities/cases/Case';
import { CognitoIdentityProvider } from '@aws-sdk/client-cognito-identity-provider';
import { MESSAGE_TYPES } from '@web-api/gateways/worker/workerRouter';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import { RawUser } from '../../entities/User';
import { SERVICE_INDICATOR_TYPES } from '../../entities/EntityConstants';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '../../../../../web-api/src/errors/errors';
import { aggregatePartiesForService } from '../../utilities/aggregatePartiesForService';
import { updateUserEmailAddress } from '@web-api/business/useCases/auth/changePasswordInteractor';

const updateCaseEntityAndGenerateChange = async ({
  applicationContext,
  rawCaseData,
  user,
}: {
  applicationContext: IApplicationContext;
  rawCaseData: Case;
  user: RawUser;
}) => {
  const caseEntity = new Case(rawCaseData, {
    applicationContext,
  });

  const petitionerObject = caseEntity.getPetitionerById(user.userId);
  if (!petitionerObject) {
    applicationContext.logger.error(
      `Could not find user|${user.userId} on ${caseEntity.docketNumber}`,
    );
    return;
  }

  const oldEmail = petitionerObject.email;
  const newData = {
    email: user.email,
    name: petitionerObject.name,
  };

  const oldData = { email: oldEmail };
  petitionerObject.email = user.email;

  if (!Case.isPetitionerRepresented(caseEntity, petitionerObject.contactId)) {
    petitionerObject.serviceIndicator = SERVICE_INDICATOR_TYPES.SI_ELECTRONIC;
  }

  const servedParties = aggregatePartiesForService(caseEntity);
  const documentType = applicationContext
    .getUtilities()
    .getDocumentTypeForAddressChange({ newData, oldData });

  applicationContext.logger.info('updateCaseEntityAndGenerateChange', {
    documentType,
    newData,
    oldData,
  });

  const privatePractitionersRepresentingContact = Case.isPetitionerRepresented(
    caseEntity,
    petitionerObject.contactId,
  );

  if (caseEntity.shouldGenerateNoticesForCase()) {
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

  return caseEntity.validate();
};

export const updatePetitionerCases = async ({
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

  applicationContext.logger.info('updatePetitionerCases', { rawCasesToUpdate });

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
      action: 'user_contact_update_no_alert_complete',
      user,
    },
    userId: user.userId,
  });

  return validCasesToUpdate;
};

export const verifyUserPendingEmailInteractor = async (
  applicationContext: ServerApplicationContext,
  { token }: { token: string },
): Promise<void> => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.EMAIL_MANAGEMENT)) {
    throw new UnauthorizedError('Unauthorized to manage emails.');
  }

  const user = await applicationContext
    .getPersistenceGateway()
    .getUserById({ applicationContext, userId: authorizedUser.userId });

  // const docketNumbersAssociatedWithUser = await applicationContext
  //   .getPersistenceGateway()
  //   .getDocketNumbersByUser({
  //     applicationContext,
  //     userId: user.userId,
  //   });

  // let userEntity;
  // if (user.role === ROLES.petitioner) {
  //   userEntity = new User(user);
  // } else {
  //   userEntity = new Practitioner(user);
  // }

  if (
    !user.pendingEmailVerificationToken ||
    user.pendingEmailVerificationToken !== token
  ) {
    throw new UnauthorizedError('Tokens do not match');
  }

  const isEmailAvailable = await applicationContext
    .getPersistenceGateway()
    .isEmailAvailable({
      applicationContext,
      email: user.pendingEmail,
    });

  if (!isEmailAvailable) {
    throw new Error('Email is not available');
  }

  const { updatedUser } = await updateUserEmailAddress(applicationContext, {
    user,
  });

  console.log('********** user', user);
  console.log('********** updatedUser', updatedUser);

  const cognito: CognitoIdentityProvider = applicationContext.getCognito();

  // TODO 10007: Move to userGateway
  // This is the problem, it never updated in cognito local
  await cognito.adminUpdateUserAttributes({
    UserAttributes: [
      {
        Name: 'email',
        Value: updatedUser.email,
      },
      {
        Name: 'email_verified',
        Value: 'true',
      },
    ],
    UserPoolId: process.env.USER_POOL_ID,
    Username: user.email, // this is the OLD email, we have to look them up by the previous one until we have changed it.
  });

  await applicationContext.getWorkerGateway().initialize(applicationContext, {
    message: {
      payload: { user: updatedUser },
      type: MESSAGE_TYPES.QUEUE_UPDATE_ASSOCIATED_CASES,
    },
  });

  // const isEmailAvailable = await applicationContext
  //   .getPersistenceGateway()
  //   .isEmailAvailable({
  //     applicationContext,
  //     email: userEntity.pendingEmail,
  //   });

  // if (!isEmailAvailable) {
  //   throw new Error('Email is not available');
  // }

  // await applicationContext.getPersistenceGateway().updateUserEmail({
  //   applicationContext,
  //   user: userEntity.validate().toRawObject(),
  // });

  // userEntity.email = userEntity.pendingEmail;
  // userEntity.pendingEmail = undefined;
  // userEntity.pendingEmailVerificationToken = undefined;

  // const updatedRawUser = userEntity.validate().toRawObject();
  // await applicationContext.getPersistenceGateway().updateUser({
  //   applicationContext,
  //   user: updatedRawUser,
  // });

  // try {
  //   if (userEntity.role === ROLES.petitioner) {
  //     await updatePetitionerCases({
  //       applicationContext,
  //       docketNumbersAssociatedWithUser,
  //       user: updatedRawUser,
  //     });
  //   } else if (userEntity.role === ROLES.privatePractitioner) {
  //     await updatePractitionerCases({
  //       applicationContext,
  //       docketNumbersAssociatedWithUser,
  //       user: updatedRawUser,
  //     });
  //   }
  // } catch (error) {
  //   applicationContext.logger.error('Unable to verify pending user email', {
  //     error,
  //   });
  //   throw error;
  // }
};
