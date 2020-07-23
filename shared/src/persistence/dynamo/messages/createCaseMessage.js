const {
  getCaseIdFromDocketNumber,
} = require('../cases/getCaseIdFromDocketNumber');
const { put } = require('../../dynamodbClientService');

/**
 * createCaseMessage
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.caseMessage the case message data
 * @returns {object} the created case message
 */
exports.createCaseMessage = async ({ applicationContext, caseMessage }) => {
  const caseId = await getCaseIdFromDocketNumber({
    applicationContext,
    docketNumber: caseMessage.docketNumber,
  });

  await put({
    Item: {
      gsi1pk: `message|${caseMessage.parentMessageId}`,
      pk: `case|${caseId}`,
      sk: `message|${caseMessage.messageId}`,
      ...caseMessage,
    },
    applicationContext,
  });
};
