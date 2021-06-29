const client = require('../../dynamodbClientService');
const { fieldsToOmitBeforePersisting } = require('./createCase');
const { omit } = require('lodash');

/**
 * updateCase
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.caseToUpdate the case data to update
 * @returns {Promise} the promise of the persistence calls
 */
exports.updateCase = async ({ applicationContext, caseToUpdate }) => {
  const setLeadCase = caseToUpdate.leadDocketNumber
    ? { gsi1pk: `case|${caseToUpdate.leadDocketNumber}` }
    : {};

  await client.put({
    Item: {
      ...setLeadCase,
      ...omit(caseToUpdate, fieldsToOmitBeforePersisting),
      pk: `case|${caseToUpdate.docketNumber}`,
      sk: `case|${caseToUpdate.docketNumber}`,
    },
    applicationContext,
  });

  return caseToUpdate;
};
