const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { generateChangeOfAddress } = require('../users/generateChangeOfAddress');
const { omit, union } = require('lodash');
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

  const oldUserInfo = await applicationContext
    .getPersistenceGateway()
    .getPractitionerByBarNumber({ applicationContext, barNumber });

  const userHasAccount = !!oldUserInfo.email;
  const userIsUpdatingEmail = !!user.updatedEmail;

  console.log(userHasAccount, userIsUpdatingEmail);

  if (oldUserInfo.userId !== user.userId) {
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
      barNumber: oldUserInfo.barNumber,
      email: oldUserInfo.email || user.updatedEmail,
    },
    { applicationContext },
  )
    .validate()
    .toRawObject();

  let updatedUser = validatedUserData;
  if (oldUserInfo.email) {
    updatedUser = await applicationContext
      .getPersistenceGateway()
      .updatePractitionerUser({
        applicationContext,
        user: validatedUserData,
      });
  } else if (!oldUserInfo.email && user.updatedEmail) {
    console.log('creating a new practitioner');
    updatedUser = await applicationContext
      .getPersistenceGateway()
      .createNewPractitionerUser({
        applicationContext,
        user: validatedUserData,
      });
  } else {
    await applicationContext.getUseCaseHelpers().updateUserRecords({
      applicationContext,
      oldUser: oldUserInfo,
      updatedUser: validatedUserData,
      userId: oldUserInfo.userId,
    });
  }

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

  console.log('updatedUser', updatedUser);
  const updatedPractitionerRaw = new Practitioner(updatedUser, {
    applicationContext,
  }).toRawObject();
  const oldPractitionerRaw = new Practitioner(oldUserInfo, {
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

  const propertiesNotRequiringChangeOfAddress = [
    'pendingEmail',
    'pendingEmailVerificationToken',
    'practitionerNotes',
  ];
  const combinedDiffKeys = union(
    Object.keys(practitionerDetailDiff),
    propertiesNotRequiringChangeOfAddress,
  );

  if (combinedDiffKeys.length > propertiesNotRequiringChangeOfAddress.length) {
    await generateChangeOfAddress({
      applicationContext,
      bypassDocketEntry,
      contactInfo: validatedUserData.contact,
      requestUserId: requestUser.userId,
      updatedEmail: validatedUserData.email,
      updatedName: validatedUserData.name,
      user: oldUserInfo,
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
