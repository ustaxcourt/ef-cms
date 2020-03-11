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
  const caseItems = await client
    .query({
      ExpressionAttributeNames: {
        '#pk': 'pk',
      },
      ExpressionAttributeValues: {
        ':pk': `case|${caseId}`,
      },
      KeyConditionExpression: '#pk = :pk',
      applicationContext,
    })
    .then(results =>
      stripWorkItems(results, applicationContext.isAuthorizedForWorkItems()),
    );

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

  const actualDocketRecord =
    docketRecord.length > 0 ? docketRecord : theCase.docketRecord;
  const actualDocuments = documents.length > 0 ? documents : theCase.documents;

  const sortedDocketRecord = sortBy(actualDocketRecord, 'index');
  const sortedDocuments = sortBy(actualDocuments, 'createdAt');

  return {
    ...theCase,
    docketRecord: sortedDocketRecord,
    documents: sortedDocuments,
    practitioners,
    respondents,
  };
};
