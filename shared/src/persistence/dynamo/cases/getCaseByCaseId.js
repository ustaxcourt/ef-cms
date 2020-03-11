const client = require('../../dynamodbClientService');
const { sortBy } = require('lodash');
const { stripWorkItems } = require('../../dynamo/helpers/stripWorkItems');

/**
 * getCaseByCaseId
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseId the case id to get
 * @returns {object} the case details
 */
exports.getCaseByCaseId = async ({ applicationContext, caseId }) => {
  const theCase = await client
    .get({
      Key: {
        pk: `case|${caseId}`,
        sk: `case|${caseId}`,
      },
      applicationContext,
    })
    .then(results =>
      stripWorkItems(results, applicationContext.isAuthorizedForWorkItems()),
    );

  if (!theCase) {
    return null;
  }

  const docketRecord = await client.query({
    ExpressionAttributeNames: {
      '#pk': 'pk',
      '#sk': 'sk',
    },
    ExpressionAttributeValues: {
      ':pk': `case|${theCase.caseId}`,
      ':prefix': 'docket-record',
    },
    KeyConditionExpression: '#pk = :pk and begins_with(#sk, :prefix)',
    applicationContext,
  });

  const documents = await client.query({
    ExpressionAttributeNames: {
      '#pk': 'pk',
      '#sk': 'sk',
    },
    ExpressionAttributeValues: {
      ':pk': `case|${theCase.caseId}`,
      ':prefix': 'document',
    },
    KeyConditionExpression: '#pk = :pk and begins_with(#sk, :prefix)',
    applicationContext,
  });

  const practitioners = await client.query({
    ExpressionAttributeNames: {
      '#pk': 'pk',
      '#sk': 'sk',
    },
    ExpressionAttributeValues: {
      ':pk': `case|${theCase.caseId}`,
      ':prefix': 'practitioner',
    },
    KeyConditionExpression: '#pk = :pk and begins_with(#sk, :prefix)',
    applicationContext,
  });

  const respondents = await client.query({
    ExpressionAttributeNames: {
      '#pk': 'pk',
      '#sk': 'sk',
    },
    ExpressionAttributeValues: {
      ':pk': `case|${theCase.caseId}`,
      ':prefix': 'respondent',
    },
    KeyConditionExpression: '#pk = :pk and begins_with(#sk, :prefix)',
    applicationContext,
  });

  const actualDocketRecord =
    docketRecord.length > 0 ? docketRecord : theCase.docketRecord;
  const actualDocuments = documents.length > 0 ? documents : theCase.documents;

  const sortedDocketRecord = sortBy(actualDocketRecord, 'index');
  const sortedDocuments = sortBy(actualDocuments, 'createdAt');

  return {
    ...theCase,
    docketRecord: sortedDocketRecord,
    documents: sortedDocuments,
    practitioners:
      practitioners.length > 0 ? practitioners : theCase.practitioners, // this is temp until sesed data fixed
    respondents: respondents.length > 0 ? respondents : theCase.respondents, // this is temp until sesed data fixed
  };
};
