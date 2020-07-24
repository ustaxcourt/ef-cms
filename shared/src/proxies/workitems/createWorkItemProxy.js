const { post } = require('../requests');

/**
 * createWorkItemInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.assigneeId the id to assign the work item to
 * @param {string} providers.docketNumber the docket number of the case to attach the work item to
 * @param {string} providers.documentId the id of the document to attach the work item to
 * @param {string} providers.message the message for creating the work item
 * @returns {Promise<*>} the promise of the api call
 */
exports.createWorkItemInteractor = ({
  applicationContext,
  assigneeId,
  docketNumber,
  documentId,
  message,
}) => {
  return post({
    applicationContext,
    body: {
      assigneeId,
      message,
    },
    endpoint: `/case-documents/${docketNumber}/${documentId}/work-items`,
  });
};
