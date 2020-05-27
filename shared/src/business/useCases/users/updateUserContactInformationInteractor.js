const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { generateChangeOfAddress } = require('./generateChangeOfAddress');
const { isEqual } = require('lodash');
const { UnauthorizedError } = require('../../../errors/errors');
const { User } = require('../../entities/User');

/**
 * updateUserContactInformationInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.contactInfo the contactInfo to update the contact info
 * @param {string} providers.userId the userId to update the contact info
 * @returns {Promise} an object is successful
 */
exports.updateUserContactInformationInteractor = async ({
  applicationContext,
  contactInfo,
  userId,
}) => {
  const authenticatedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authenticatedUser, ROLE_PERMISSIONS.UPDATE_CONTACT_INFO)) {
    throw new UnauthorizedError('Unauthorized');
  }

  if (authenticatedUser.userId !== userId) {
    throw new UnauthorizedError('Unauthorized');
  }

  const user = await applicationContext
    .getPersistenceGateway()
    .getUserById({ applicationContext, userId });

  if (isEqual(user.contact, contactInfo)) {
    throw new Error('there were no changes found needing to be updated');
  }

  const userEntity = new User({
    ...user,
    contact: { ...contactInfo },
  });

  await applicationContext.getPersistenceGateway().updateUser({
    applicationContext,
    user: userEntity.validate().toRawObject(),
  });

  const updatedCases = await generateChangeOfAddress({
    applicationContext,
    contactInfo,
    user,
  });

  return updatedCases;
};
