const client = require('../../dynamodbClientService');
const { omit } = require('lodash');

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
        ...omit(caseToCreate, [
          'documents',
          'irsPractitioners',
          'privatePractitioners',
          'docketRecord',
        ]),
      },
      applicationContext,
    }),
    ...caseToCreate.docketRecord.map(docketEntry =>
      client.put({
        Item: {
          pk: `case|${caseToCreate.docketNumber}`,
          sk: `docket-record|${docketEntry.docketRecordId}`,
          ...docketEntry,
        },
        applicationContext,
      }),
    ),
    ...caseToCreate.documents.map(document =>
      client.put({
        Item: {
          pk: `case|${caseToCreate.docketNumber}`,
          sk: `document|${document.documentId}`,
          ...document,
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
    client.put({
      Item: {
        docketNumber: caseToCreate.docketNumber,
        pk: 'catalog',
        sk: `case|${caseToCreate.docketNumber}`,
      },
      applicationContext,
    }),
  ]);

  return results;
};
