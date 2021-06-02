const client = require('../../dynamodbClientService');
const {
  getCaseDeadlinesByDocketNumber,
} = require('../caseDeadlines/getCaseDeadlinesByDocketNumber');
const { Case } = require('../../../business/entities/cases/Case');
const { createCaseDeadline } = require('../caseDeadlines/createCaseDeadline');
const { fieldsToOmitBeforePersisting } = require('./createCase');
const { omit } = require('lodash');
const { updateMessage } = require('../messages/updateMessage');

/**
 * updateCase
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.caseToUpdate the case data to update
 * @returns {Promise} the promise of the persistence calls
 */
exports.updateCase = async ({ applicationContext, caseToUpdate, oldCase }) => {
  const requests = [];

  if (
    oldCase.status !== caseToUpdate.status ||
    oldCase.caseCaption !== caseToUpdate.caseCaption ||
    oldCase.docketNumberSuffix !== caseToUpdate.docketNumberSuffix
  ) {
    const messageMappings = await client.query({
      ExpressionAttributeNames: {
        '#pk': 'pk',
        '#sk': 'sk',
      },
      ExpressionAttributeValues: {
        ':pk': `case|${caseToUpdate.docketNumber}`,
        ':prefix': 'message',
      },
      KeyConditionExpression: '#pk = :pk and begins_with(#sk, :prefix)',
      applicationContext,
    });

    messageMappings.forEach(message => {
      if (oldCase.status !== caseToUpdate.status) {
        message.caseStatus = caseToUpdate.status;
      }
      if (oldCase.caseCaption !== caseToUpdate.caseCaption) {
        message.caseTitle = Case.getCaseTitle(caseToUpdate.caseCaption);
      }
      if (oldCase.docketNumberSuffix !== caseToUpdate.docketNumberSuffix) {
        message.docketNumberSuffix = caseToUpdate.docketNumberSuffix;
      }
      requests.push(
        updateMessage({
          applicationContext,
          message,
        }),
      );
    });
  }

  if (oldCase.associatedJudge !== caseToUpdate.associatedJudge) {
    const deadlines = await getCaseDeadlinesByDocketNumber({
      applicationContext,
      docketNumber: caseToUpdate.docketNumber,
    });
    const updatedDeadlineRequests = deadlines.map(caseDeadline => {
      caseDeadline.associatedJudge = caseToUpdate.associatedJudge;
      return createCaseDeadline({
        applicationContext,
        caseDeadline,
      });
    });
    requests.push(...updatedDeadlineRequests);
  }

  const setLeadCase = caseToUpdate.leadDocketNumber
    ? { gsi1pk: `case|${caseToUpdate.leadDocketNumber}` }
    : {};

  await Promise.all([
    client.put({
      Item: {
        ...setLeadCase,
        ...omit(caseToUpdate, fieldsToOmitBeforePersisting),
        pk: `case|${caseToUpdate.docketNumber}`,
        sk: `case|${caseToUpdate.docketNumber}`,
      },
      applicationContext,
    }),
    ...requests,
  ]);

  return caseToUpdate;
};
