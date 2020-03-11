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

  const caseItems =
    (await client
      .query({
        ExpressionAttributeNames: {
          '#pk': 'pk',
        },
        ExpressionAttributeValues: {
          ':pk': `case|${theCase.caseId}`,
        },
        KeyConditionExpression: '#pk = :pk',
        applicationContext,
      })
      .then(results =>
        stripWorkItems(results, applicationContext.isAuthorizedForWorkItems()),
      )) || [];

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
