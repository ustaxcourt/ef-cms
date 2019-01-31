const {
  isAuthorized,
  WORKITEM,
} = require('../../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../../errors/errors');

exports.getCompletedWorkItemsForSection = async ({
  section,
  applicationContext,
}) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user.userId, WORKITEM)) {
    throw new UnauthorizedError(
      'Unauthorized for getting completed work items',
    );
  }

  const workItems = await applicationContext
    .getPersistenceGateway()
    .getCompletedWorkItemsForSection({
      section,
      applicationContext,
    });

  return workItems;
};
