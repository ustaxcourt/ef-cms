const client = require('../../dynamodbClientService');
const { omit } = require('lodash');

const fieldsToOmitBeforePersisting = [
  'archivedCorrespondences',
  'archivedDocketEntries',
  'correspondence',
  'docketEntries',
  'hearings',
  'irsPractitioners',
  'privatePractitioners',
];

/**
 * createCase -- should usually be called via createCaseAndAssociations use-case helper.
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.caseToCreate the case data
 * @returns {object} the case data
 */
exports.createCase = async ({ applicationContext, caseToCreate }) => {
  return client.put({
    Item: {
      ...omit(caseToCreate, fieldsToOmitBeforePersisting),
      pk: `case|${caseToCreate.docketNumber}`,
      sk: `case|${caseToCreate.docketNumber}`,
    },
    applicationContext,
  });
};

exports.fieldsToOmitBeforePersisting = fieldsToOmitBeforePersisting;
