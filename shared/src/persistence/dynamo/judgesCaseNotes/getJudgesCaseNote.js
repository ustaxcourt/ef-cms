const client = require('../../dynamodbClientService');
const { stripInternalKeys } = require('../helpers/stripInternalKeys');

/**
 * getJudgesCaseNote
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseId the id of the case to get the case notes for
 * @param {string} providers.userId the id of the judge to get the case notes for
 * @returns {Promise} the promise of the persistence call to get the record
 */
exports.getJudgesCaseNote = async ({ applicationContext, caseId, userId }) => {
  return await client
    .get({
      Key: {
        pk: `judges-case-note|${caseId}`,
        sk: `${userId}`,
      },
      applicationContext,
    })
    .then(stripInternalKeys);
};
