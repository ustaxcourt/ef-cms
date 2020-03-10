const client = require('../../dynamodbClientService');
const {
  getRecordViaMapping,
} = require('../../dynamo/helpers/getRecordViaMapping');
const { sortBy } = require('lodash');
const { stripWorkItems } = require('../../dynamo/helpers/stripWorkItems');

/**
 * getCaseByDocketNumber
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.docketNumber the docket number to get
 * @returns {object} the case details
 */
exports.getCaseByDocketNumber = async ({
  applicationContext,
  docketNumber,
}) => {
  const theCase = await getRecordViaMapping({
    applicationContext,
    pk: `case-by-docket-number|${docketNumber}`,
    prefix: 'case',
  }).then(aCase =>
    stripWorkItems(aCase, applicationContext.isAuthorizedForWorkItems()),
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

  const sortedDocketRecord = sortBy(docketRecord, 'index');
  const sortedDocuments = sortBy(documents, 'createdAt');

  return {
    ...theCase,
    docketRecord: sortedDocketRecord,
    documents: sortedDocuments,
    practitioners,
    respondents,
  };
};
