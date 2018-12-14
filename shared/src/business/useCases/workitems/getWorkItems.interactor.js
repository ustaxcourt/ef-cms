const {
  isAuthorized,
  WORKITEM,
} = require('../../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../../errors/errors');
//const WorkItem = require('../entities/WorkItem');

/**
 * getWorkItems
 *
 * @param userId
 * @param applicationContext
 * @returns {Promise<*>}
 */
exports.getWorkItems = async ({ userId, applicationContext }) => {
  if (!isAuthorized(userId, WORKITEM)) {
    throw new UnauthorizedError('Unauthorized');
  }

  // let workItems = await applicationContext
  //   .getPersistenceGateway()
  //   .getWorkItemsForUser({
  //     userId,
  //     applicationContext,
  //   });

  // if (!workItems) {
  //   workItems = [];
  // }

  // return WorkItem.validateRawCollection(workItems);

  //MOCK REMOVE WHEN IMPLEMENTED
  let ctx = applicationContext;
  return [
    {
      workItemId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      assigneeId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      docketNumber: '101-18',
      ctx: ctx.getUseCases().getWorkItems !== undefined,
    },
  ];
};
