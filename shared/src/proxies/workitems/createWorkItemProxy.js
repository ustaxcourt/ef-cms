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
  assigneeId,
  caseId,
  documentId,
  message,
  applicationContext,
}) => {
  return post({
    applicationContext,
    body: {
      assigneeId,
      message,
    },
    endpoint: `/cases/${caseId}/documents/${documentId}/workitems`,
  });
};
