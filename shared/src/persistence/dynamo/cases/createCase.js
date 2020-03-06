const client = require('../../dynamodbClientService');
const {
  createCaseCatalogRecord,
} = require('../../dynamo/cases/createCaseCatalogRecord');
const {
  createMappingRecord,
} = require('../../dynamo/helpers/createMappingRecord');
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
  console.log('NEW CASE', caseToCreate);

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
    createMappingRecord({
      applicationContext,
      pkId: caseToCreate.userId,
      skId: caseToCreate.caseId,
      type: 'case',
    }),
    createMappingRecord({
      applicationContext,
      pkId: caseToCreate.docketNumber,
      skId: caseToCreate.caseId,
      type: 'case',
    }),
    createCaseCatalogRecord({
      applicationContext,
      caseId: caseToCreate.caseId,
    }),
  ]);

  console.log('results', results);

  return stripWorkItems(results, applicationContext.isAuthorizedForWorkItems());
};
