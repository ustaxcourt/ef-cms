const User = require('../entities/User');

const {
  isAuthorized,
  WORKITEM,
} = require('../../authorization/authorizationClientService');

const { UnauthorizedError } = require('../../errors/errors');

/**
 * getInternalUsers
 * @param sectionType
 * @returns {Promise<User[]>}
 */
exports.getInternalUsers = async ({ applicationContext }) => {
  if (!isAuthorized(applicationContext.getCurrentUser(), WORKITEM)) {
    throw new UnauthorizedError('Unauthorized');
  }

  // TODO: return internal users from database
  return User.validateRawCollection([
    new User({ userId: 'docketclerk', role: 'docketclerk' }).toRawObject(),
    new User({ userId: 'docketclerk1', role: 'docketclerk' }).toRawObject(),
    new User({
      userId: 'petitionsclerk1',
      role: 'petitionsclerk',
    }).toRawObject(),
  ]);
};
