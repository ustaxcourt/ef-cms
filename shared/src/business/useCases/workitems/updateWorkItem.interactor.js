// const WorkItem = require('../entities/WorkItem');
const {
  isAuthorized,
  WORKITEM,
} = require('../../../authorization/authorizationClientService');
const {
  // UnprocessableEntityError,
  UnauthorizedError,
} = require('../../../errors/errors');

// const setDocumentDetails = (userId, documents) => {
//   if (documents && userId) {
//     documents.forEach(document => {
//       if (document.validated && !document.reviewDate) {
//         document.reviewDate = new Date().toISOString();
//         document.reviewUser = userId;
//         document.status = 'reviewed';
//       }
//     });
//   }
//
//   return documents;
// };

/**
 * updateWorkItem
 *
 * @param workItemId
 * @param workItemToUpdate
 * @param userId
 * @param applicationContext
 * @returns {*}
 */
exports.updateWorkItem = async ({
  userId,
  workItemToUpdate,
  workItemId,
  applicationContext,
}) => {
  if (!isAuthorized(userId, WORKITEM)) {
    throw new UnauthorizedError('Unauthorized for update case');
  }

  // if (workItemId !== workItemToUpdate.workItemId) {
  //   throw new UnprocessableEntityError();
  // }
  //
  // const updatedWorkItem = new WorkItem(workItemToUpdate)
  //   .validate()
  //   .toJSON();
  //
  // const caseAfterUpdate = await applicationContext
  //   .getPersistenceGateway()
  //   .saveWorkItem({
  //     workItemToSave: updatedWorkItem,
  //     applicationContext,
  //   });
  //
  // return new WorkItem(caseAfterUpdate).validate().toJSON();

  //MOCK REMOVE WHEN IMPLEMENTED
  let ctx = applicationContext;
  workItemToUpdate = {
    workItemId: workItemId,
    assigneeId: userId,
    docketNumber: '101-18',
    ctx: ctx.getUseCases().updateWorkItem !== undefined,
  };

  return workItemToUpdate;
};
