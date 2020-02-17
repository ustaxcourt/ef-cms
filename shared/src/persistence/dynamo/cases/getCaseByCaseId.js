const client = require('../../dynamodbClientService');
const { stripWorkItems } = require('../../dynamo/helpers/stripWorkItems');

/**
 * getCaseByCaseId
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseId the case id to get
 * @returns {object} the case details
 */
exports.getCaseByCaseId = ({ applicationContext, caseId }) => {
  return client
    .get({
      Key: {
        pk: caseId,
        sk: caseId,
      },
      applicationContext,
    })
    .then(results =>
      stripWorkItems(results, applicationContext.isAuthorizedForWorkItems()),
    );
};
