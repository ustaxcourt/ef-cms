const { stripInternalKeys } = require('../../dynamo/helpers/stripInternalKeys');
const { stripWorkItems } = require('../../dynamo/helpers/stripWorkItems');

const client = require('../../dynamodbClientService');
/**
 * getCaseByCaseId
 * @param caseId
 * @param applicationContext
 * @returns {*}
 */
exports.getCaseByCaseId = ({ applicationContext, caseId }) => {
  return client
    .get({
      Key: {
        pk: caseId,
        sk: '0',
      },
      applicationContext,
    })
    .then(results =>
      stripWorkItems(
        stripInternalKeys(results),
        applicationContext.isAuthorizedForWorkItems(),
      ),
    );
};
