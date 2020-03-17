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

  const theCase = caseItems.filter(item => item.sk.startsWith('case|')).pop();

  const docketRecord = caseItems.filter(item =>
    item.sk.startsWith('docket-record|'),
  );
  const documents = caseItems.filter(item => item.sk.startsWith('document|'));
  const privatePractitioners = caseItems.filter(item =>
    item.sk.startsWith('privatePractitioner|'),
  );
  const irsPractitioners = caseItems.filter(item =>
    item.sk.startsWith('irsPractitioner|'),
  );

  const sortedDocketRecord = sortBy(docketRecord, 'index');
  const sortedDocuments = sortBy(documents, 'createdAt');

  return {
    ...theCase,
    docketRecord: sortedDocketRecord,
    documents: sortedDocuments,
    irsPractitioners,
    privatePractitioners,
  };
};
