const client = require('../../dynamodbClientService');
const { stripWorkItems } = require('../../dynamo/helpers/stripWorkItems');

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
        pk: `case|${caseToCreate.caseId}`,
        sk: `case|${caseToCreate.caseId}`,
        ...caseToCreate,
      },
      applicationContext,
    }),
    ...caseToCreate.docketRecord.map(docketEntry =>
      client.put({
        Item: {
          pk: `case|${caseToCreate.caseId}`,
          sk: `docket-record|${docketEntry.docketRecordId}`,
          ...docketEntry,
        },
        applicationContext,
      }),
    ),
    ...caseToCreate.documents.map(document =>
      client.put({
        Item: {
          pk: `case|${caseToCreate.caseId}`,
          sk: `document|${document.documentId}`,
          ...document,
        },
        applicationContext,
      }),
    ),
    ...caseToCreate.respondents.map(respondent =>
      client.put({
        Item: {
          pk: `case|${caseToCreate.caseId}`,
          sk: `respondent|${respondent.userId}`,
          ...respondent,
        },
        applicationContext,
      }),
    ),
    ...caseToCreate.practitioners.map(practitioner =>
      client.put({
        Item: {
          pk: `case|${caseToCreate.caseId}`,
          sk: `practitioner|${practitioner.userId}`,
          ...practitioner,
        },
        applicationContext,
      }),
    ),
    client.put({
      Item: {
        pk: `user|${caseToCreate.userId}`,
        sk: `case|${caseToCreate.caseId}`,
      },
      applicationContext,
    }),
    client.put({
      Item: {
        pk: `case-by-docket-number|${caseToCreate.docketNumber}`,
        sk: `case|${caseToCreate.caseId}`,
      },
      applicationContext,
    }),
    client.put({
      Item: {
        caseId: caseToCreate.caseId,
        pk: 'catalog',
        sk: `case|${caseToCreate.caseId}`,
      },
      applicationContext,
    }),
  ]);

  return stripWorkItems(results, applicationContext.isAuthorizedForWorkItems());
};
