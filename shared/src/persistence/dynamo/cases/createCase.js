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
 * createCase
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.caseToCreate the case data
 * @returns {object} the case data
 */
exports.createCase = async ({ applicationContext, caseToCreate }) => {
  const [results] = await Promise.all([
    client.put({
      Item: {
        pk: `case|${caseToCreate.docketNumber}`,
        sk: `case|${caseToCreate.docketNumber}`,
        ...omit(caseToCreate, fieldsToOmitBeforePersisting),
      },
      applicationContext,
    }),
    ...caseToCreate.docketEntries.map(docketEntry =>
      client.put({
        Item: {
          pk: `case|${caseToCreate.docketNumber}`,
          sk: `docket-entry|${docketEntry.docketEntryId}`,
          ...docketEntry,
        },
        applicationContext,
      }),
    ),
    ...caseToCreate.irsPractitioners.map(practitioner =>
      client.put({
        Item: {
          pk: `case|${caseToCreate.docketNumber}`,
          sk: `irsPractitioner|${practitioner.userId}`,
          ...practitioner,
        },
        applicationContext,
      }),
    ),
    ...caseToCreate.privatePractitioners.map(practitioner =>
      client.put({
        Item: {
          pk: `case|${caseToCreate.docketNumber}`,
          sk: `privatePractitioner|${practitioner.userId}`,
          ...practitioner,
        },
        applicationContext,
      }),
    ),
  ]);

  return results;
};

exports.fieldsToOmitBeforePersisting = fieldsToOmitBeforePersisting;
