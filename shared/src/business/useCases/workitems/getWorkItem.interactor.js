// const {
//   isAuthorized,
//   WORKITEM,
// } = require('../../authorization/authorizationClientService');
// const { NotFoundError, UnauthorizedError } = require('../../errors/errors');
// const WorkItem = require('../entities/WorkItem');

/**
 * getWorkItem
 *
 * @param userId
 * @param workItemId
 * @param applicationContext
 * @returns {Promise<*>}
 */
exports.getWorkItem = async ({ userId, workItemId, applicationContext }) => {
  // const workItem = await applicationContext
  //   .getPersistenceGateway()
  //   .getWorkItemById({
  //     workItemId,
  //     applicationContext,
  //   });
  //
  // if (!workItem) {
  //   throw new NotFoundError(`WorkItem ${workItemId} was not found.`);
  // }
  //

  //
  // return new WorkItem(workItem).validate().toJSON();
  //MOCK REMOVE WHEN IMPLEMENTED
  let ctx = applicationContext;
  return {
    workItemId: workItemId,
    assigneeId: userId,
    docketNumber: '101-18',
    ctx: ctx.getUseCases().getWorkItem !== undefined,
  };
};
