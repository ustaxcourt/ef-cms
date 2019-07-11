const { post } = require('../requests');

/**
 * createWorkItem
 *
 * @param completedMessage
 * @param workItemId
 * @param applicationContext
 * @returns {Promise<*>}
 */
exports.createWorkItem = ({
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
