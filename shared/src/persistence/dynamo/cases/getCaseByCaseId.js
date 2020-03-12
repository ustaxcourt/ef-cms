const client = require('../../dynamodbClientService');
const { sortBy } = require('lodash');

/**
 * getCaseByCaseId
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseId the case id to get
 * @returns {object} the case details
 */
exports.getCaseByCaseId = async ({ applicationContext, caseId }) => {
  const caseItems = await client.query({
    ExpressionAttributeNames: {
      '#pk': 'pk',
    },
    ExpressionAttributeValues: {
      ':pk': `case|${caseId}`,
    },
    KeyConditionExpression: '#pk = :pk',
    applicationContext,
  });

  if (!caseItems) {
    return null;
  }

  const theCase = caseItems.filter(item => item.sk.includes('case|')).pop();

  const docketRecord = caseItems.filter(item =>
    item.sk.includes('docket-record|'),
  );
  const documents = caseItems.filter(item => item.sk.includes('document|'));
  const practitioners = caseItems.filter(item =>
    item.sk.includes('practitioner|'),
  );
  const respondents = caseItems.filter(item => item.sk.includes('respondent|'));

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
