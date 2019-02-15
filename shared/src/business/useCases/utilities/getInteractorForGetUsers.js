const { getUsersInSection } = require('../users/getUsersInSection.interactor');
const { getInternalUsers } = require('../users/getInternalUsers.interactor');
const {
  isAuthorized,
  CASE_METADATA,
} = require('../../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../../errors/errors');

exports.getInteractorForGetUsers = ({ section, applicationContext }) => {
  const user = applicationContext.getCurrentUser();
  if (!isAuthorized(user, CASE_METADATA)) {
    throw new UnauthorizedError('Unauthorized');
  }

  if (section) {
    return getUsersInSection;
  } else {
    return getInternalUsers;
  }
};
