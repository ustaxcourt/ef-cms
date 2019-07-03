const { post } = require('../requests');

/**
 * createWorkItemInteractor
 *
 * @param completedMessage
 * @param workItemId
 * @param applicationContext
 * @returns {Promise<*>}
 */
exports.createWorkItemInteractor = ({
  applicationContext,
  assigneeId,
  caseId,
  documentId,
  message,
}) => {
  return post({
    applicationContext,
    body: {
      assigneeId,
      message,
    },
    endpoint: `/cases/${caseId}/documents/${documentId}/work-items`,
  });
};
