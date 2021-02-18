const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { generateChangeOfAddress } = require('../users/generateChangeOfAddress');
const { isEqual, omit } = require('lodash');
const { Practitioner } = require('../../entities/Practitioner');
const { SERVICE_INDICATOR_TYPES } = require('../../entities/EntityConstants');
const { UnauthorizedError } = require('../../../errors/errors');

const updateUserPendingEmail = async ({ applicationContext, user }) => {
  const isEmailAvailable = await applicationContext
    .getPersistenceGateway()
    .isEmailAvailable({
      applicationContext,
      email: user.updatedEmail,
    });

  if (!isEmailAvailable) {
    throw new Error('Email is not available');
  }

  const pendingEmailVerificationToken = applicationContext.getUniqueId();
  user.pendingEmailVerificationToken = pendingEmailVerificationToken;
  user.pendingEmail = user.updatedEmail;
};

const getUpdatedFieldNames = ({ applicationContext, oldUser, updatedUser }) => {
  const updatedPractitionerRaw = new Practitioner(updatedUser, {
    applicationContext,
  }).toRawObject();
  const oldPractitionerRaw = new Practitioner(oldUser, {
    applicationContext,
  }).toRawObject();

  const practitionerDetailDiff = applicationContext
    .getUtilities()
    .getAddressPhoneDiff({
      newData: {
        ...omit(updatedPractitionerRaw, 'contact'),
        ...updatedPractitionerRaw.contact,
      },
      oldData: {
        ...omit(oldPractitionerRaw, 'contact'),
        ...oldPractitionerRaw.contact,
      },
    });

  return Object.keys(practitionerDetailDiff).sort();
};

/**
 * updatePractitionerUserInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.barNumber the barNumber of the user to update
 * @param {object} providers.user the user data
 * @returns {Promise} the promise of the createUser call
 */
exports.updatePractitionerUserInteractor = async ({
  applicationContext,
  barNumber,
  bypassDocketEntry,
  user,
}) => {
  const requestUser = applicationContext.getCurrentUser();

  if (
    !isAuthorized(requestUser, ROLE_PERMISSIONS.ADD_EDIT_PRACTITIONER_USER) ||
    !isAuthorized(requestUser, ROLE_PERMISSIONS.EMAIL_MANAGEMENT)
  ) {
    throw new UnauthorizedError('Unauthorized for updating practitioner user');
  }

  const oldUser = await applicationContext
    .getPersistenceGateway()
    .getPractitionerByBarNumber({ applicationContext, barNumber });

  const userHasAccount = !!oldUser.email;
  const userIsUpdatingEmail = !!user.updatedEmail;

  if (oldUser.userId !== user.userId) {
    throw new Error('Bar number does not match user data.');
  }

  if (!userHasAccount && userIsUpdatingEmail) {
    user.serviceIndicator = SERVICE_INDICATOR_TYPES.SI_ELECTRONIC;
  }

  if (userHasAccount && userIsUpdatingEmail) {
    await updateUserPendingEmail({ applicationContext, user });
  }

  // do not allow edit of bar number
  const validatedUserData = new Practitioner(
    {
      ...user,
      barNumber: oldUser.barNumber,
      email: oldUser.email || user.updatedEmail,
    },
    { applicationContext },
  )
    .validate()
    .toRawObject();

  const updatedUser = await applicationContext
    .getPersistenceGateway()
    .updatePractitionerUser({
      applicationContext,
      isNewAccount: !userHasAccount && userIsUpdatingEmail,
      user: validatedUserData,
    });

  await applicationContext.getNotificationGateway().sendNotificationToUser({
    applicationContext,
    message: {
      action: 'admin_contact_initial_update_complete',
    },
    userId: requestUser.userId,
  });

  if (userHasAccount && userIsUpdatingEmail) {
    await applicationContext.getUseCaseHelpers().sendEmailVerificationLink({
      applicationContext,
      pendingEmail: user.pendingEmail,
      pendingEmailVerificationToken: user.pendingEmailVerificationToken,
    });
  }

  const updatedFields = getUpdatedFieldNames({
    applicationContext,
    oldUser,
    updatedUser,
  });

  const hasUpdatedEmailOnly = isEqual(updatedFields, [
    'pendingEmail',
    'pendingEmailVerificationToken',
  ]);

  if (!hasUpdatedEmailOnly) {
    await generateChangeOfAddress({
      applicationContext,
      bypassDocketEntry,
      contactInfo: validatedUserData.contact,
      requestUserId: requestUser.userId,
      updatedEmail: validatedUserData.email,
      updatedName: validatedUserData.name,
      user: oldUser,
      websocketMessagePrefix: 'admin',
    });
  }

  await applicationContext.getNotificationGateway().sendNotificationToUser({
    applicationContext,
    message: {
      action: 'admin_contact_full_update_complete',
    },
    userId: requestUser.userId,
  });

  return new Practitioner(updatedUser, { applicationContext })
    .validate()
    .toRawObject();
};
